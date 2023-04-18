import joi from 'joi';
import express from 'express';
import { 
    NodeCreateModel, 
    NodeUpdateModel, 
    NodeSearchFilters 
} from '../../../domain.types/engine/node.domain.types';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import { EventActionType, NodeType } from '../../../domain.types/engine/engine.types';
import { 
    ActionInputParamsObj_Create,
    ActionInputParamsObj_Update,
    ActionOutputParamsObj_Create,
    ActionOutputParamsObj_Update,
    ContinuityInputParamsObj_Create,
    ContinuityInputParamsObj_Update,
    DataExtractionInputParamsObj_Create,
    DataExtractionInputParamsObj_Update,
    DataStorageInputParamsObj_Create,
    DataStorageInputParamsObj_Update,
    RangeComparisonInputParamsObj_Create,
    RangeComparisonInputParamsObj_Update,
    ValueComparisonInputParamsObj_Create,
    ValueComparisonInputParamsObj_Update
} from '../../common.validations';

///////////////////////////////////////////////////////////////////////////////////////////////

export class NodeValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request)
        : Promise<NodeCreateModel> => {
        try {

            const possibleInputs = [
                ActionInputParamsObj_Create,
                ContinuityInputParamsObj_Create,
                DataExtractionInputParamsObj_Create,
                DataStorageInputParamsObj_Create,
                RangeComparisonInputParamsObj_Create,
                ValueComparisonInputParamsObj_Create,
            ];
            const possibleOutputs = [
                ActionOutputParamsObj_Create
            ];
            const node = joi.object({
                Type        : joi.string().valid(...Object.values(NodeType)).required(),
                Name        : joi.string().max(32).required(),
                Description : joi.string().max(256).optional(),
                ParentNodeId    : joi.string().uuid().required(),
                SchemaId    : joi.string().uuid().required(),
                Action   : {
                    ActionType  : joi.string().valid(...Object.values(EventActionType)).required(),
                    Name        : joi.string().max(32).required(),
                    Description : joi.string().max(256).optional(),
                    InputParams : joi.object().valid(possibleInputs).optional(),
                    OutputParams: joi.object().valid(possibleOutputs).optional(),
                }
            });
            await node.validateAsync(request.body);
            return {
                Type        : request.body.Type,
                Name        : request.body.Name,
                Description : request.body.Description ?? null,
                ParentNodeId: request.body.ParentNodeId,
                SchemaId    : request.body.SchemaId,
                Action      : {
                    Name       : request.body.Action.Name,
                    Description: request.body.Action.Description ?? null,
                    ActionType : request.body.Action.ActionType,
                    InputParams : request.body.Action.InputParams ?? null,
                    OutputParams : request.body.Action.OutputParams ?? null,
                },
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request): Promise<NodeUpdateModel|undefined> => {
        try {
            const possibleInputs = [
                ActionInputParamsObj_Update,
                ContinuityInputParamsObj_Update,
                DataExtractionInputParamsObj_Update,
                DataStorageInputParamsObj_Update,
                RangeComparisonInputParamsObj_Update,
                ValueComparisonInputParamsObj_Update,
            ];
            const possibleOutputs = [
                ActionOutputParamsObj_Update
            ];
            const node = joi.object({
                Type         : joi.string().valid(...Object.values(NodeType)).optional(),
                Name         : joi.string().max(32).optional(),
                Description  : joi.string().max(256).optional(),
                ParentNodeId : joi.string().uuid().optional(),
                SchemaId     : joi.string().uuid().optional(),
                Action: {
                    ActionType : joi.string().valid(...Object.values(EventActionType)).optional(),
                    Name       : joi.string().max(32).optional(),
                    Description: joi.string().max(256).optional(),
                    InputParams : joi.object().valid(possibleInputs).optional(),
                    OutputParams: joi.object().valid(possibleOutputs).optional(),
                }
            });
            await node.validateAsync(request.body);
            return {
                Type        : request.body.Type ?? null,
                Name        : request.body.Name ?? null,
                Description : request.body.Description ?? null,
                ParentNodeId: request.body.ParentNodeId ?? null,
                SchemaId    : request.body.SchemaId ?? null,
                Action      : request.body.Action ? {
                    Name        : request.body.Action.Name ?? null,
                    Description : request.body.Action.Description ?? null,
                    ActionType  : request.body.Action.ActionType ?? null,
                    InputParams : request.body.Action &&
                                  request.body.Action?.InputParams ? 
                                  request.body.Action?.InputParams : null,
                    OutputParams: request.body.Action &&
                                  request.body.Action?.OutputParams ? 
                                  request.body.Action?.OutputParams : null,
                }: null,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request)
        : Promise<NodeSearchFilters> => {
        try {
            const node = joi.object({
                type        : joi.string().valid(...Object.values(NodeType)).optional(),
                parentNodeId: joi.string().uuid().optional(),
                schemaId    : joi.string().uuid().optional(),
                name        : joi.string().max(64).optional()
            });
            await node.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): NodeSearchFilters => {

        var filters = {};

        var type = query.type ? query.type : null;
        if (type != null) {
            filters['Type'] = type;
        }
        var name = query.name ? query.name : null;
        if (name != null) {
            filters['Name'] = name;
        }
        var parentNodeId = query.parentNodeId ? query.parentNodeId : null;
        if (parentNodeId != null) {
            filters['ParentNodeId'] = parentNodeId;
        }
        var schemaId = query.schemaId ? query.schemaId : null;
        if (schemaId != null) {
            filters['SchemaId'] = schemaId;
        }
        
        return filters;
    };

}
