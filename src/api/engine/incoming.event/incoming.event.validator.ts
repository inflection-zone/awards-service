import joi from 'joi';
import express from 'express';
import { IncomingEventCreateModel, IncomingEventSearchFilters } from '../../../domain.types/engine/incoming.event.types';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////////////

export class IncomingEventValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request)
        : Promise<IncomingEventCreateModel> => {
        try {
            const condition = joi.object({
                TypeId      : joi.string().uuid().required(),
                ReferenceId : joi.string().uuid().required(),
                Payload     : joi.any().required(),
            });
            await condition.validateAsync(request.body);
            const model: IncomingEventCreateModel = {
                TypeId      : request.body.IncomingEventTypeId,
                ReferenceId : request.body.ReferenceId,
                Payload     : request.body.Payload,
            };
            return model;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request)
        : Promise<IncomingEventSearchFilters> => {
        try {
            const condition = joi.object({
                typeId      : joi.string().uuid().optional(),
                referenceId : joi.string().uuid().optional(),
            });
            await condition.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): IncomingEventSearchFilters => {

        var filters = {};

        var typeId = query.typeId ? query.typeId : null;
        if (typeId != null) {
            filters['TypeId'] = typeId;
        }
        var ReferenceId = query.ReferenceId ? query.ReferenceId : null;
        if (ReferenceId != null) {
            filters['ReferenceId'] = ReferenceId;
        }
        return filters;
    };

}
