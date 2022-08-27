import * as joi from 'joi';
import {
    ErrorHandler
} from '../../common/error.handler';

///////////////////////////////////////////////////////////////////////////////////////////////

export class ClientValidator {

    static validateCreateRequest = async (requestBody) => {
        try {
            const schema = joi.object({
                ClientName: joi.string().max(256).required(),
                ClientCode: joi.string().max(32).optional(),
                Phone: joi.string().max(16).min(6).optional(),
                Email: joi.string().max(256).optional()
            });
            return await schema.validateAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

    static validateUpdateRequest = async (requestBody) => {
        try {
            const schema = joi.object({
                ClientName: joi.string().max(256).optional(),
                ClientCode: joi.string().max(32).optional(),
                Phone: joi.string().max(16).min(6).optional(),
                Email: joi.string().max(256).optional()
            });
            return await schema.validateAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

    static validateSearchRequest = async (query) => {
        try {
            const schema = joi.object({
                clientName: joi.string().max(256).optional(),
                clientCode: joi.string().max(32).optional()
            });
            return await schema.validateAsync(query);

        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

}