import joi from 'joi';
import express from 'express';
import { RuleCreateModel, RuleUpdateModel, RuleSearchFilters } from '../../../domain.types/engine/rule.domain.types';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import { EventActionType } from '../../../domain.types/engine/engine.types';

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
                    InputParams: joi.any().optional(),
                    Name        : joi.string().max(32).required(),
                    Description : joi.string().max(256).optional(),
                    Params      : {
                        Message    : joi.string().max(256).required(),
                        NextNodeId : joi.any().optional(),
                        Extra      : joi.any().optional()
                    }
                }
            });
            await rule.validateAsync(request.body);
            return {
                Name         : request.body.Name,
                Description  : request.body.Description ?? null,
                ParentNodeId : request.body.ParentNodeId,
                SchemaId     : request.body.SchemaId,
                Action       : {
                    Name        : request.body.Action.Name,
                    InputParams : request.body.Action.InputParams ?? null,
                    Description : request.body.Action.Description ?? null,
                    ActionType  : request.body.Action.ActionType,
                    Params      : {
                        Message    : request.body.Action.Params.Message,
                        NextNodeId : request.body.Action.Params.NextNodeId ?? null,
                        Extra      : request.body.Action.Params.Extra ?? null,
                    }
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
                    InputParams: joi.any().optional(),
                    Description : joi.string().max(256).optional(),
                    Params      : {
                        Message    : joi.string().max(256).optional(),
                        Action     : joi.string().valid(...Object.values(EventActionType)).optional(),
                        NextNodeId : joi.string().uuid().optional(),
                        Extra      : joi.any().optional()
                    }
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
                    InputParams : request.body.Action.InputParams ?? null,
                    Params      : request.body.Action?.Params ? {
                        Message    : request.body.Action.Params.Message ?? null,
                        NextNodeId : request.body.Action.Params.NextNodeId ?? null,
                        Extra      : request.body.Action.Params.Extra ?? null,
                    } : null,
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
