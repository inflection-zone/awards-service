import joi from 'joi';
import express from 'express';
import { SchemaCreateModel, SchemaUpdateModel, SchemaSearchFilters } from '../../../domain.types/engine/schema.domain.types';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import { SchemaType } from '../../../domain.types/engine/engine.enums';

///////////////////////////////////////////////////////////////////////////////////////////////

export class SchemaValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request): Promise<SchemaCreateModel> => {
        try {
            const schema = joi.object({
                ClientId     : joi.string().uuid().required(),
                Name         : joi.string().max(32).required(),
                Description  : joi.string().max(256).optional(),
                Type         : joi.string().valid(...Object.values(SchemaType)).required(),
                ValidFrom    : joi.date().iso().greater('now').optional(),
                ValidTill    : joi.date().iso().greater(joi.ref('ValidFrom')).optional(),
                IsValid      : joi.boolean().optional(),
                EventTypeIds : joi.array().items(joi.string().uuid()).optional(),
            });
            await schema.validateAsync(request.body);
            return {
                ClientId    : request.body.ClientId,
                Name        : request.body.Name,
                Description : request.body.Description ?? null,
                Type        : request.body.Type,
                ValidFrom   : request.body.ValidFrom ?? new Date(),
                ValidTill   : request.body.ValidTill ?? null,
                IsValid     : request.body.IsValid ?? true,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request): Promise<SchemaUpdateModel|undefined> => {
        try {
            const schema = joi.object({
                ClientId     : joi.string().uuid().optional(),
                Name         : joi.string().max(32).optional(),
                Type         : joi.string().valid(...Object.values(SchemaType)).optional(),
                Description  : joi.string().max(256).optional(),
                ValidFrom    : joi.date().iso().greater('now').optional(),
                ValidTill    : joi.date().iso().greater(joi.ref('ValidFrom')).optional(),
                IsValid      : joi.boolean().optional(),
                EventTypeIds : joi.array().items(joi.string().uuid()).optional(),
            });
            await schema.validateAsync(request.body);
            return {
                ClientId    : request.body.ClientId ?? null,
                Name        : request.body.Name ?? null,
                Type        : request.body.Type ?? null,
                Description : request.body.Description ?? null,
                ValidFrom   : request.body.ValidFrom ?? null,
                ValidTill   : request.body.ValidTill ?? null,
                IsValid     : request.body.IsValid ?? null,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<SchemaSearchFilters> => {
        try {
            const schema = joi.object({
                clientId : joi.string().uuid().optional(),
                name     : joi.string().max(64).optional(),
            });
            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): SchemaSearchFilters => {

        var filters = {};

        var name = query.name ? query.name : null;
        if (name != null) {
            filters['Name'] = name;
        }
        var clientId = query.clientId ? query.clientId : null;
        if (clientId != null) {
            filters['ClientId'] = clientId;
        }
        
        return filters;
    };

}
