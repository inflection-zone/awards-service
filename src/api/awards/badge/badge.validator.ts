import joi from 'joi';
import express from 'express';
import { BadgeCreateModel, BadgeUpdateModel, BadgeSearchFilters } from '../../../domain.types/awards/badge.domain.types';
import {
    ErrorHandler
} from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////////////

export class BadgeValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request): Promise<BadgeCreateModel> => {
        try {
            const schema = joi.object({
                CategoryId  : joi.string().uuid().required(),
                ClientId    : joi.string().uuid().required(),
                Name        : joi.string().max(32).required(),
                Description : joi.string().max(256).optional(),
                ImageUrl    : joi.string().max(1024).uri().required(),
            });
            await schema.validateAsync(request.body);
            return {
                Name       : request.body.Name,
                CategoryId : request.body.CategoryId,
                ClientId   : request.body.ClientId,
                Description: request.body.Description ?? null,
                ImageUrl   : request.body.ImageUrl
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request): Promise<BadgeUpdateModel|undefined> => {
        try {
            const schema = joi.object({
                CategoryId  : joi.string().uuid().optional(),
                ClientId    : joi.string().uuid().optional(),
                Name        : joi.string().max(32).optional(),
                Description : joi.string().max(256).optional(),
                ImageUrl    : joi.string().max(1024).uri().optional(),
            });
            await schema.validateAsync(request.body);
            const id = await this.validateParamAsUUID(request, 'id');
            return {
                id,
                Name       : request.body.Name ?? null,
                CategoryId : request.body.CategoryId ?? null,
                ClientId   : request.body.ClientId ?? null,
                Description: request.body.Description ?? null,
                ImageUrl   : request.body.ImageUrl ?? null
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<BadgeSearchFilters> => {
        try {
            const schema = joi.object({
                categoryId : joi.string().uuid().optional(),
                clientId   : joi.string().uuid().optional(),
                name       : joi.string().max(64).optional(),
            });
            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): BadgeSearchFilters => {

        var filters = {};

        var name = query.name ? query.name : null;
        if (name != null) {
            filters['Name'] = name;
        }
        var clientId = query.clientId ? query.clientId : null;
        if (clientId != null) {
            filters['ClientId'] = clientId;
        }
        var categoryId = query.categoryId ? query.categoryId : null;
        if (categoryId != null) {
            filters['CategoryId'] = categoryId;
        }

        return filters;
    };

}
