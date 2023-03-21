import joi from 'joi';
import express from 'express';
import * as apikeyGenerator from 'uuid-apikey';
import { ClientCreateModel, ClientUpdateModel, ClientVerificationModel } from '../../domain.types/client/client.domain.types';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { TimeUtils } from '../../common/utilities/time.utils';
import { DurationType } from '../../domain.types/miscellaneous/time.types';
import { ClientSearchFilters } from '../../domain.types/client/client.domain.types';
import { StringUtils } from '../../common/utilities/string.utils';
import BaseValidator from '../base.validator';

///////////////////////////////////////////////////////////////////////////////////////////////

export class ClientValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request): Promise<ClientCreateModel> => {
        try {
            const schema = joi.object({
                Name        : joi.string().max(256).required(),
                Code        : joi.string().max(256).optional(),
                IsPrivileged: joi.boolean().optional(),
                CountryCode : joi.string().max(5).optional(),
                Phone       : joi.string().min(5).max(16).required(),
                Email       : joi.string().email().required(),
                Password    : joi.string().min(6).max(18).optional(),
                ApiKey      : joi.string().max(32).optional(),
                ValidFrom   : joi.date().optional(),
                ValidTill   : joi.date().optional()
            });
            await schema.validateAsync(request.body) as ClientCreateModel;
            if (!request.body.ApiKey) {
                request.body.ApiKey = apikeyGenerator.default.create().apiKey;
            }
            if (!request.body.ValidFrom) {
                request.body.ValidFrom = new Date();
            }
            if (!request.body.ValidTill) {
                request.body.ValidTill = TimeUtils.addDuration(new Date(), 180, DurationType.Day);
            }
            return {
                Name        : request.body.Name,
                Code        : request.body.Code ?? null,
                IsPrivileged: request.body.IsPrivileged ?? null,
                CountryCode : request.body.CountryCode ?? null,
                Phone       : request.body.Phone,
                Email       : request.body.Email,
                Password    : request.body.Password ?? null,
                ApiKey      : request.body.Name ?? null,
                ValidFrom   : request.body.Name ?? null,
                ValidTill   : request.body.Name ?? null,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: any): Promise<ClientUpdateModel> => {
        try {
            const schema = joi.object({
                Name : joi.string().max(256).optional(),
                Code         : joi.string().max(256).optional(),
                IsPrivileged : joi.boolean().optional(),
                CountryCode  : joi.string().optional(),
                Phone        : joi.string().optional(),
                Email        : joi.string().email().optional(),
                Password     : joi.string().optional(),
                ApiKey       : joi.string().optional(),
                ValidFrom    : joi.date().optional(),
                ValidTill    : joi.date().optional()
            });
            await schema.validateAsync(request.body);
            return {
                Name        : request.body.Name ?? null,
                Code        : request.body.Code ?? null,
                IsPrivileged: request.body.IsPrivileged ?? null,
                CountryCode : request.body.CountryCode ?? null,
                Phone       : request.body.Phone ?? null,
                Email       : request.body.Email ?? null,
                Password    : request.body.Password ?? null,
                ApiKey      : request.body.Name ?? null,
                ValidFrom   : request.body.Name ?? null,
                ValidTill   : request.body.Name ?? null,
            };

        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<ClientSearchFilters> => {
        try {
            const schema = joi.object({
                name         : joi.string().max(256).optional(),
                code         : joi.string().max(256).optional(),
                isPrivileged : joi.boolean().optional(),
                countryCode  : joi.string().optional(),
                phone        : joi.string().optional(),
                email        : joi.string().email().optional(),
                validFrom    : joi.date().optional(),
                validTill    : joi.date().optional()
            });
            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): ClientSearchFilters => {

        var filters = {};

        var name = query.name ? query.name : null;
        if (name != null) {
            filters['Name'] = name;
        }
        var code = query.code ? query.code : null;
        if (code != null) {
            filters['Code'] = code;
        }
        var isPrivileged = query.isPrivileged ? query.isPrivileged : null;
        if (isPrivileged != null) {
            filters['IsPrivileged'] = isPrivileged;
        }
        var countryCode = query.countryCode ? query.countryCode : null;
        if (countryCode != null) {
            filters['CountryCode'] = countryCode;
        }
        var phone = query.phone ? query.phone : null;
        if (phone != null) {
            filters['Phone'] = phone;
        }
        var email = query.email ? query.email : null;
        if (email != null) {
            filters['Email'] = email;
        }
        var validFrom = query.validFrom ? query.validFrom : null;
        if (validFrom != null) {
            filters['ValidFrom'] = validFrom;
        }
        var validTill = query.validTill ? query.validTill : null;
        if (validTill != null) {
            filters['ValidTill'] = validTill;
        }

        return filters;
    };

    public getOrRenewApiKey = async ( request: express.Request): 
        Promise<ClientVerificationModel|null> => {
        try {
            const authHeader = request.headers['authorization']?.toString();
            let tokens = authHeader? authHeader.split(' ') : null;
            if (!tokens || tokens.length < 1) {
                ErrorHandler.throwInputValidationError('Ill-formated authorization header');
                return null;
            }
            if (tokens.length < 2) {
                throw new Error("Invalid authorization header.");
            }
            if (tokens[0].toLowerCase() !== 'basic') {
                throw new Error('Invalid auth header formatting. Should be basic authorization.');
            }
            const load = StringUtils.decodeFromBase64(tokens[1]);
            tokens = load.split(':');
            if (tokens.length < 2) {
                throw new Error("Basic auth formatting error.");
            }
            const clientCode = tokens[0].trim();
            const password = tokens[1].trim();

            const schema = joi.object({
                ValidFrom : joi.date().optional(),
                ValidTill : joi.date().optional()
            });
            await schema.validateAsync(request.body);
            return this.getVerificationDomainModel(request.body, clientCode, password);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
        return null;
    };

    public getVerificationDomainModel = async (body: any, clientCode: string, password: string):
        Promise<ClientVerificationModel> => {

        let model: ClientVerificationModel|null = null;
        model = {
            Code      : clientCode,
            Password  : password,
            ValidFrom : body.ValidFrom ?? new Date(),
            ValidTill : body.ValidTill ?? TimeUtils.addDuration(new Date(), 180, DurationType.Day),
        };

        return model;
    };

}
