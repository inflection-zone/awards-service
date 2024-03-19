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
                Description : joi.string().max(256).allow('', null).optional(),
                ImageUrl    : joi.string().max(1024).uri().required(),
            });
            await schema.validateAsync(request.body);
            return {
                Name        : request.body.Name,
                CategoryId  : request.body.CategoryId,
                ClientId    : request.body.ClientId,
                Description : request.body.Description ?? null,
                ImageUrl    : request.body.ImageUrl
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
                Description : joi.string().max(256).allow('', null).optional(),
                ImageUrl    : joi.string().max(1024).uri().optional(),
            });
            await schema.validateAsync(request.body);
            return {
                Name        : request.body.Name ?? null,
                CategoryId  : request.body.CategoryId ?? null,
                ClientId    : request.body.ClientId ?? null,
                Description : request.body.Description ?? null,
                ImageUrl    : request.body.ImageUrl ?? null
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<BadgeSearchFilters> => {
        try {
            const schema = joi.object({
                categoryId   : joi.string().uuid().optional(),
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
