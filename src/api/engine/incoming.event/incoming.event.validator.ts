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
            const event = joi.object({
                TypeId      : joi.string().uuid().required(),
                ReferenceId : joi.string().uuid().required(),
                Payload     : joi.any().required(),
            });
   
            await event.validateAsync(request.body);
            const model: IncomingEventCreateModel = {
                TypeId      : request.body.TypeId,
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
                typeId       : joi.string().uuid().optional(),
                referenceId  : joi.string().uuid().optional(),
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
