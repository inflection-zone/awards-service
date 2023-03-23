import joi from 'joi';
import express from 'express';
import { 
    SchemaInstanceCreateModel, 
    SchemaInstanceUpdateModel, 
    SchemaInstanceSearchFilters 
} from '../../../domain.types/engine/schema.instance.domain.types';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';

///////////////////////////////////////////////////////////////////////////////////////////////

export class SchemaInstanceValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request): Promise<SchemaInstanceCreateModel> => {
        try {
            const schema = joi.object({
                SchemaId : joi.string().uuid().required(),
                ContextId: joi.string().uuid().required(),
            });
            await schema.validateAsync(request.body);
            return {
                SchemaId : request.body.SchemaId,
                ContextId: request.body.ContextId,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request): Promise<SchemaInstanceUpdateModel|undefined> => {
        try {
            const schema = joi.object({
                SchemaId : joi.string().uuid().optional(),
                ContextId: joi.string().uuid().optional(),
            });
            await schema.validateAsync(request.body);
            return {
                SchemaId : request.body.SchemaId ?? null,
                ContextId: request.body.ContextId ?? null,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<SchemaInstanceSearchFilters> => {
        try {
            const schema = joi.object({
                schemaId : joi.string().uuid().optional(),
                contextId: joi.string().uuid().optional(),
            });
            await schema.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): SchemaInstanceSearchFilters => {

        var filters = {};

        var schemaId = query.schemaId ? query.schemaId : null;
        if (schemaId != null) {
            filters['SchemaId'] = schemaId;
        }
        var contextId = query.contextId ? query.contextId : null;
        if (contextId != null) {
            filters['ContextId'] = contextId;
        }
        
        return filters;
    };

}
