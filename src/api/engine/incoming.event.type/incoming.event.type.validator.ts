import joi from 'joi';
import express from 'express';
import { IncomingEventTypeCreateModel, IncomingEventTypeUpdateModel, IncomingEventTypeSearchFilters } from '../../../domain.types/engine/incoming.event.type.types';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////////////

export class IncomingEventTypeValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request)
        : Promise<IncomingEventTypeCreateModel> => {
        try {
            const type = joi.object({
                Name        : joi.string().max(32).required(),
                Description : joi.string().max(256).allow('', null).optional(),
            });
            await type.validateAsync(request.body);
            return {
                Name        : request.body.Name,
                Description : request.body.Description ?? null,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request)
        : Promise<IncomingEventTypeUpdateModel> => {
        try {
            const condition = joi.object({
                Name        : joi.string().max(32).optional(),
                Description : joi.string().max(256).allow('', null).optional(),
            });
            await condition.validateAsync(request.body);
            return {
                Name        : request.body.Name ?? null,
                Description : request.body.Description ?? null,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request)
        : Promise<IncomingEventTypeSearchFilters> => {
        try {
            const condition = joi.object({
                name         : joi.string().optional(),
                pageIndex    : joi.number().min(0).optional(),
                itemsPerPage : joi.number().min(1).optional(),
                orderBy      : joi.string().max(256).optional(),
                order        : joi.string().valid('ascending', 'descending').optional()
                    .error(()=> new Error("order param: 'ascending' and 'descending' are the only valid values.")),
            });
            await condition.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): IncomingEventTypeSearchFilters => {
        var filters = {};
        var name = query.name ? query.name : null;
        if (name != null) {
            filters['Name'] = name;
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
