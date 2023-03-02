import z from 'zod';
import express from 'express';
import * as apikeyGenerator from 'uuid-apikey';
import { ClientCreateModel, ClientUpdateModel, ClientVerificationModel } from '../../domain.types/client/client.domain.types';
import {
    ErrorHandler
} from '../../common/error.handler';
import { Helper } from '../../common/helper';
import { TimeHelper } from '../../common/time.helper';
import { DurationType } from '../../domain.types/miscellaneous/time.types';
import { ClientSearchFilters } from '../../domain.types/client/client.domain.types';

///////////////////////////////////////////////////////////////////////////////////////////////

export class ClientValidator {

    static validateCreateRequest = async (requestBody: any): Promise<ClientCreateModel> => {
        try {
            const schema = z.object({
                Name : z.string({
                    required_error     : 'Name is required',
                    invalid_type_error : 'Name must be string',
                }).max(256),
                Code         : z.string().max(256).optional(),
                IsPrivileged : z.boolean().optional(),
                CountryCode  : z.string().max(5).optional(),
                Phone        : z.string().min(5).max(16),
                Email        : z.string({
                    required_error : 'Email is required',
                }).email(),
                Password  : z.string().min(6).max(18).optional(),
                ApiKey    : z.string().max(32).optional(),
                ValidFrom : z.date().optional(),
                ValidTill : z.date().optional()
            });
            const parsed = await schema.parseAsync(requestBody) as ClientCreateModel;
            if (!parsed.ApiKey) {
                parsed.ApiKey = apikeyGenerator.default.create().apiKey;
            }
            if (!parsed.ValidFrom) {
                parsed.ValidFrom = new Date();
            }
            if (!parsed.ValidTill) {
                parsed.ValidTill = TimeHelper.addDuration(new Date(), 180, DurationType.Day);
            }
            return parsed;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validateUpdateRequest = async (requestBody: any): Promise<ClientUpdateModel> => {
        try {
            const schema = z.object({
                Name : z.string({
                    invalid_type_error : 'Name must be a string.'
                }).max(256).optional(),
                Code         : z.string().max(256).optional(),
                IsPrivileged : z.boolean().optional(),
                CountryCode  : z.string().optional(),
                Phone        : z.string().optional(),
                Email        : z.string().email().optional(),
                Password     : z.string().optional(),
                ApiKey       : z.string().optional(),
                ValidFrom    : z.date().optional(),
                ValidTill    : z.date().optional()
            });
            const parsed = await schema.parseAsync(requestBody) as ClientUpdateModel;
            return parsed;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static validateSearchRequest = async (query): Promise<ClientSearchFilters> => {
        try {
            const schema = z.object({
                name         : z.string().max(256).optional(),
                code         : z.string().max(256).optional(),
                isPrivileged : z.boolean().optional(),
                countryCode  : z.string().optional(),
                phone        : z.string().optional(),
                email        : z.string().email().optional(),
                validFrom    : z.date().optional(),
                validTill    : z.date().optional()
            });
            const parsed = await schema.parseAsync(query) as ClientSearchFilters;
            const filters = ClientValidator.getSearchFilters(parsed);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static getSearchFilters = (query): ClientSearchFilters => {

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

    static getOrRenewApiKey = async ( request: express.Request
    ): Promise<ClientVerificationModel> => {
        try {
            const authHeader = request.headers['authorization'].toString();
            let tokens = authHeader.split(' ');
            if (tokens.length < 2) {
                throw new Error("Invalid authorization header.");
            }
            if (tokens[0].toLowerCase() !== 'basic') {
                throw new Error('Invalid auth header formatting. Should be basic authorization.');
            }
            const load = Helper.decodeFromBase64(tokens[1]);
            tokens = load.split(':');
            if (tokens.length < 2) {
                throw new Error("Basic auth formatting error.");
            }
            const clientCode = tokens[0].trim();
            const password = tokens[1].trim();

            const schema = z.object({
                ValidFrom : z.date().optional(),
                ValidTill : z.date().optional()
            });
        await schema.parseAsync(request.body) as ClientSearchFilters;
        return ClientValidator.getVerificationDomainModel(request.body, clientCode, password);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    static getVerificationDomainModel = async (body: any, clientCode: string, password: string):
        Promise<ClientVerificationModel> => {

        let model: ClientVerificationModel = null;
        model = {
            Code      : clientCode,
            Password  : password,
            ValidFrom : body.ValidFrom ?? new Date(),
            ValidTill : body.ValidTill ?? TimeHelper.addDuration(new Date(), 180, DurationType.Day),
        };

        return model;
    };

}
