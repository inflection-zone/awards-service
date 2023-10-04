import joi from 'joi';
import express from 'express';
import { BadgeCategoryCreateModel, BadgeCategoryUpdateModel, BadgeCategorySearchFilters } from '../../../domain.types/awards/badge.category.domain.types';
import {
    ErrorHandler
} from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////////////

export class BadgeCategoryValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request)
        : Promise<BadgeCategoryCreateModel> => {
        try {
            const schema = joi.object({
                ClientId    : joi.string().uuid().required(),
                Name        : joi.string().max(32).required(),
                Description : joi.string().max(256).allow('', null).optional(),
                ImageUrl    : joi.string().max(1024).uri().required(),
            });
            await schema.validateAsync(request.body);
            return {
                Name        : request.body.Name,
                ClientId    : request.body.ClientId,
                Description : request.body.Description ?? null,
                ImageUrl    : request.body.ImageUrl
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request)
        : Promise<BadgeCategoryUpdateModel> => {
        try {
            const schema = joi.object({
                ClientId    : joi.string().uuid().optional(),
                Name        : joi.string().max(32).optional(),
                Description : joi.string().max(256).allow('', null).optional(),
                ImageUrl    : joi.string().max(1024).uri().optional(),
            });
            await schema.validateAsync(request.body);
            return {
                Name        : request.body.Name ?? null,
                ClientId    : request.body.ClientId ?? null,
                Description : request.body.Description ?? null,
                ImageUrl    : request.body.ImageUrl ?? null
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request)
        : Promise<BadgeCategorySearchFilters> => {
        try {
            const schema = joi.object({
                clientId     : joi.string().uuid().optional(),
                name         : joi.string().max(64).optional(),
                pageIndex    : joi.number().min(0).optional(),
                itemsPerPage : joi.number().min(1).optional(),
                orderBy      : joi.string().max(256).optional(),
                order        : joi.string().valid('ascending', 'descending').optional()
                    .error(()=> new Error("order param: 'ascending' and 'descending' are the only valid values.")),
            });
            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): BadgeCategorySearchFilters => {

        var filters = {};

        var name = query.name ? query.name : null;
        if (name != null) {
            filters['Name'] = name;
        }
        var clientId = query.clientId ? query.clientId : null;
        if (clientId != null) {
            filters['ClientId'] = clientId;
        }
        var itemsPerPage = query.itemsPerPage ? query.itemsPerPage : 25;
        if (itemsPerPage != null) {
            filters['ItemsPerPage'] = itemsPerPage;
        }
        var orderBy = query.orderBy ? query.orderBy : 'CreatedAt';
        if (orderBy != null) {
            filters['OrderBy'] = orderBy;
        }
        var order = query.order ? query.order : 'ASC';
        if (order != null) {
            filters['Order'] = order;
        }
        return filters;
    };

}
