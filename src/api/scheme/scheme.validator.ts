import * as joi from 'joi';
import {
    ErrorHandler
} from '../../common/error.handler';

///////////////////////////////////////////////////////////////////////////////////////////////

export class SchemeValidator {

    static validateCreateRequest = async (requestBody) => {
        try {
            const schema = joi.object({
                ClientId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                Name: joi.string().max(256).optional(),
                Description: joi.string().max(512).optional()
            });
            return await schema.validateAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

    static validateUpdateRequest = async (requestBody) => {
        try {
            const schema = joi.object({
                ClientId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                Name: joi.string().max(256).optional(),
                Description: joi.string().max(512).optional()
            });
            return await schema.validateAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

    static validateSearchRequest = async (query) => {
        try {
            const schema = joi.object({
                clientId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                name: joi.string().max(256).optional(),
                validFrom: joi.date().iso().optional(),
                validTill: joi.date().iso().optional()
            });
            return await schema.validateAsync(query);

        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

}