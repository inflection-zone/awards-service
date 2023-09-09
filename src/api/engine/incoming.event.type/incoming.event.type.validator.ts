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
                name : joi.string().optional(),
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
        return filters;
    };

}
