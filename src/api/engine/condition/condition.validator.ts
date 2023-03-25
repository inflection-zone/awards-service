import joi from 'joi';
import express from 'express';
import { ConditionCreateModel, ConditionUpdateModel, ConditionSearchFilters } from '../../../domain.types/engine/condition.types';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import { CompositionOperator, LogicalOperator, MathematicalOperator, OperandDataType, OperatorType } from '../../../domain.types/engine/enums';

///////////////////////////////////////////////////////////////////////////////////////////////

export class ConditionValidator extends BaseValidator {

    public validateCreateRequest = async (request: express.Request)
        : Promise<ConditionCreateModel> => {
        try {
            const condition = joi.object({
                Name                : joi.string().max(32).required(),
                Description         : joi.string().max(256).optional(),
                RuleId              : joi.string().uuid().required(),
                ParentConditionId   : joi.string().uuid().required(),
                Operator            : joi.string().valid(...Object.values(OperatorType)).optional(),
                Fact                : joi.string().max(32).optional(),
                Value               : joi.any().optional(),
                DataType            : joi.string().valid(...Object.values(OperandDataType)).optional(),
                LogicalOperator     : joi.string().valid(...Object.values(LogicalOperator)).optional(),
                MathematicalOperator: joi.string().valid(...Object.values(MathematicalOperator)).optional(),
                CompositionOperator : joi.string().valid(...Object.values(CompositionOperator)).optional(),
            });
            await condition.validateAsync(request.body);
            return {
                Name                : request.body.Name,
                Description         : request.body.Description ?? null,
                RuleId              : request.body.RuleId,
                ParentConditionId   : request.body.ParentConditionId,
                Operator            : request.body.Operator ?? OperatorType.Composition,
                Fact                : request.body.Name ?? null,
                Value               : request.body.Name ?? null,
                DataType            : request.body.Name ?? OperandDataType.Text,
                LogicalOperator     : request.body.Name ?? LogicalOperator.None,
                MathematicalOperator: request.body.Name ?? MathematicalOperator.None,
                CompositionOperator : request.body.Name ?? CompositionOperator.None,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateUpdateRequest = async (request: express.Request)
        : Promise<ConditionUpdateModel> => {
        try {
            const condition = joi.object({
                Name                : joi.string().max(32).optional(),
                Description         : joi.string().max(256).optional(),
                RuleId              : joi.string().uuid().optional(),
                ParentConditionId   : joi.string().uuid().optional(),
                Operator            : joi.string().valid(...Object.values(OperatorType)).optional(),
                Fact                : joi.string().max(32).optional(),
                Value               : joi.any().optional(),
                DataType            : joi.string().valid(...Object.values(OperandDataType)).optional(),
                LogicalOperator     : joi.string().valid(...Object.values(LogicalOperator)).optional(),
                MathematicalOperator: joi.string().valid(...Object.values(MathematicalOperator)).optional(),
                CompositionOperator : joi.string().valid(...Object.values(CompositionOperator)).optional(),
            });
            await condition.validateAsync(request.body);
            return {
                Name                : request.body.Name ?? null,
                Description         : request.body.Description ?? null,
                RuleId              : request.body.RuleId ?? null,
                ParentConditionId   : request.body.ParentConditionId ?? null,
                Operator            : request.body.Operator ?? null,
                Fact                : request.body.Name ?? null,
                Value               : request.body.Name ?? null,
                DataType            : request.body.Name ?? null,
                LogicalOperator     : request.body.Name ?? null,
                MathematicalOperator: request.body.Name ?? null,
                CompositionOperator : request.body.Name ?? null,
            };
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    public validateSearchRequest = async (request: express.Request)
        : Promise<ConditionSearchFilters> => {
        try {
            const condition = joi.object({
                parentConditionId: joi.string().uuid().optional(),
                ruleId           : joi.string().uuid().optional(),
                name             : joi.string().max(64).optional(),
            });
            await condition.validateAsync(request.query);
            const filters = this.getSearchFilters(request.query);
            return filters;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

    private getSearchFilters = (query): ConditionSearchFilters => {

        var filters = {};

        var name = query.name ? query.name : null;
        if (name != null) {
            filters['Name'] = name;
        }
        var parentConditionId = query.parentConditionId ? query.parentConditionId : null;
        if (parentConditionId != null) {
            filters['ParentConditionId'] = parentConditionId;
        }
        var ruleId = query.ruleId ? query.ruleId : null;
        if (ruleId != null) {
            filters['RuleId'] = ruleId;
        }
        return filters;
    };

}
