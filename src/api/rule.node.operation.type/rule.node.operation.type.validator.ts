import * as joi from 'joi';
import {
    ErrorHandler
} from '../../common/error.handler';

///////////////////////////////////////////////////////////////////////////////////////////////

export class RuleNodeOperationTypeValidator {

    static validateCreateRequest = async (requestBody) => {
        try {
            const schema = joi.object({
                Composition: joi.string().valid("and", "or").required(),
                Logical: joi.string().valid("", "").required(),
                Mathematical: joi.string().valid("", "").required()
            });
            return await schema.validateAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

    static validateUpdateRequest = async (requestBody) => {
        try {
            const schema = joi.object({
                Composition: joi.string().valid("and", "or").optional(),
                Logical: joi.string().valid("", "").optional(),
                Mathematical: joi.string().valid("", "").optional()
            });
            return await schema.validateAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

    static validateSearchRequest = async (query) => {
        try {
            const schema = joi.object({
                composition: joi.string().valid("and", "or").optional(),
                logical: joi.string().valid("", "").optional(),
                mathematical: joi.string().valid("", "").optional()
            });
            return await schema.validateAsync(query);

        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

}