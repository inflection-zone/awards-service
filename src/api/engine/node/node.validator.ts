import joi from 'joi';
import express from 'express';
import { NodeCreateModel, NodeUpdateModel, NodeSearchFilters } from '../../../domain.types/engine/node.domain.types';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import { EventActionType } from '../../../domain.types/engine/engine.enums';

///////////////////////////////////////////////////////////////////////////////////////////////

export class NodeValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request)
        : Promise<NodeCreateModel> => {
        try {
            const node = joi.object({
                Name        : joi.string().max(32).required(),
                Description : joi.string().max(256).optional(),
                ParentNodeId    : joi.string().uuid().required(),
                SchemaId    : joi.string().uuid().required(),
                DefaultAction   : {
                    ActionType : joi.string().valid(...Object.values(EventActionType)).required(),
                    Name       : joi.string().max(32).required(),
                    Description: joi.string().max(256).optional(),
                    Params     : {
                        Message   : joi.string().max(256).required(),
                        Action    : joi.string().valid(...Object.values(EventActionType)).optional(),
                        NextNodeId: joi.string().uuid().optional(),
                        Extra     : joi.any().optional()
                    }
                }
            });
            await node.validateAsync(request.body);
            return {
                Name        : request.body.Name,
                Description : request.body.Description ?? null,
                ParentNodeId: request.body.ParentNodeId,
                SchemaId    : request.body.SchemaId,
                DefaultAction      : {
                    Name       : request.body.Action.Name,
                    Description: request.body.Action.Description ?? null,
                    ActionType : request.body.Action.ActionType,
                    Params     : {
                        Message   : request.body.Action.Params.Message,
                        Action    : request.body.Action.Params.Action ?? request.body.Action.ActionType,
                        NextNodeId: request.body.Action.Params.NextNodeId ?? null,
                        Extra     : request.body.Action.Params.Extra ?? null,
                    }
                },
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request): Promise<NodeUpdateModel|undefined> => {
        try {
            const node = joi.object({
                Name         : joi.string().max(32).optional(),
                Description  : joi.string().max(256).optional(),
                ParentNodeId : joi.string().uuid().optional(),
                SchemaId     : joi.string().uuid().optional(),
                DefaultAction: {
                    ActionType : joi.string().valid(...Object.values(EventActionType)).optional(),
                    Name       : joi.string().max(32).optional(),
                    Description: joi.string().max(256).optional(),
                    Params     : {
                        Message   : joi.string().max(256).optional(),
                        Action    : joi.string().valid(...Object.values(EventActionType)).optional(),
                        NextNodeId: joi.string().uuid().optional(),
                        Extra     : joi.any().optional()
                    }
                }
            });
            await node.validateAsync(request.body);
            return {
                Name        : request.body.Name ?? null,
                Description : request.body.Description ?? null,
                ParentNodeId: request.body.ParentNodeId ?? null,
                SchemaId    : request.body.SchemaId ?? null,
                DefaultAction      : request.body.Action ? {
                    Name       : request.body.Action.Name ?? null,
                    Description: request.body.Action.Description ?? null,
                    ActionType : request.body.Action.ActionType ?? null,
                    Params     : request.body.Action?.Params? {
                    Message   : request.body.Action.Params.Message ?? null,
                    Action    : request.body.Action.Params.Action ?? null,
                    NextNodeId: request.body.Action.Params.NextNodeId ?? null,
                    Extra     : request.body.Action.Params.Extra ?? null,
                    }         : null,
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
