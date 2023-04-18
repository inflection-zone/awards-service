import joi from 'joi';
import express from 'express';
import { RuleCreateModel, RuleUpdateModel, RuleSearchFilters } from '../../../domain.types/engine/rule.domain.types';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import { EventActionType } from '../../../domain.types/engine/engine.types';
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
    ValueComparisonInputParamsObj_Update } from '../../../api/common.validations';

///////////////////////////////////////////////////////////////////////////////////////////////

export class RuleValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request)
        : Promise<RuleCreateModel> => {
        try {
            const rule = joi.object({
                Name         : joi.string().max(32).required(),
                Description  : joi.string().max(256).optional(),
                ParentNodeId : joi.string().uuid().required(),
                SchemaId     : joi.string().uuid().required(),
                Action       : {
                    ActionType  : joi.string().valid(...Object.values(EventActionType)).required(),
                    Name        : joi.string().max(32).required(),
                    Description : joi.string().max(256).optional(),
                    InputParams : joi.alternatives().try(
                        ActionInputParamsObj_Create,
                        ContinuityInputParamsObj_Create,
                        DataExtractionInputParamsObj_Create,
                        DataStorageInputParamsObj_Create,
                        RangeComparisonInputParamsObj_Create,
                        ValueComparisonInputParamsObj_Create).optional(),
                    OutputParams: joi.alternatives().try(ActionOutputParamsObj_Create).optional(),
            }
            });
            await rule.validateAsync(request.body);
            return {
                Name         : request.body.Name,
                Description  : request.body.Description ?? null,
                ParentNodeId : request.body.ParentNodeId,
                SchemaId     : request.body.SchemaId,
                Action       : {
                    ActionType  : request.body.Action.ActionType,
                    Name        : request.body.Action.Name,
                    Description : request.body.Action.Description ?? null,
                    InputParams : request.body.Action.InputParams ?? null,
                    OutputParams : request.body.Action.OutputParams ?? null,
                },
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request): Promise<RuleUpdateModel> => {
        try {
            const rule = joi.object({
                Name         : joi.string().max(32).optional(),
                Description  : joi.string().max(256).optional(),
                ParentNodeId : joi.string().uuid().optional(),
                SchemaId     : joi.string().uuid().optional(),
                Action       : {
                    ActionType  : joi.string().valid(...Object.values(EventActionType)).optional(),
                    Name        : joi.string().max(32).optional(),
                    Description : joi.string().max(256).optional(),
                    InputParams : joi.alternatives().try(
                        ActionInputParamsObj_Update,
                        ContinuityInputParamsObj_Update,
                        DataExtractionInputParamsObj_Update,
                        DataStorageInputParamsObj_Update,
                        RangeComparisonInputParamsObj_Update,
                        ValueComparisonInputParamsObj_Update).optional(),
                    OutputParams: joi.alternatives().try(ActionOutputParamsObj_Update).optional(),
                }
            });
            await rule.validateAsync(request.body);
            return {
                Name         : request.body.Name ?? null,
                Description  : request.body.Description ?? null,
                ParentNodeId : request.body.ParentNodeId ?? null,
                SchemaId     : request.body.SchemaId ?? null,
                Action       : request.body.Action ? {
                    Name        : request.body.Action.Name ?? null,
                    Description : request.body.Action.Description ?? null,
                    ActionType  : request.body.Action.ActionType ?? null,
                    InputParams : request.body.Action &&
                                  request.body.Action?.InputParams ? 
                                  request.body.Action?.InputParams : null,
                    OutputParams: request.body.Action &&
                                  request.body.Action?.OutputParams ? 
                                  request.body.Action?.OutputParams : null,
                } : null,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request): Promise<RuleSearchFilters> => {
        try {
            const rule = joi.object({
                parentNodeId : joi.string().uuid().optional(),
                conditionId  : joi.string().uuid().optional(),
                name         : joi.string().max(64).optional(),
            });
            await rule.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): RuleSearchFilters => {

        var filters = {};

        var name = query.name ? query.name : null;
        if (name != null) {
            filters['Name'] = name;
        }
        var parentNodeId = query.parentNodeId ? query.parentNodeId : null;
        if (parentNodeId != null) {
            filters['ParentNodeId'] = parentNodeId;
        }
        var conditionId = query.conditionId ? query.conditionId : null;
        if (conditionId != null) {
            filters['ConditionId'] = conditionId;
        }
        return filters;
    };

}
