import * as joi from 'joi';
import {
    ErrorHandler
} from '../../common/error.handler';

///////////////////////////////////////////////////////////////////////////////////////////////

export class ParticipantValidator {

    static validateCreateRequest = async (requestBody) => {
        try {
            const schema = joi.object({
                ClientId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                FirstName: joi.string().max(64).optional(),
                LastName: joi.string().max(64).optional(),
                Phone: joi.string().max(16).min(6).optional(),
                Email: joi.string().max(256).optional(),
                Gender: joi.string().valid("Male", "Female", "Other").required(),
                BirthDate: joi.date().iso().optional()
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
                FirstName: joi.string().max(64).optional(),
                LastName: joi.string().max(64).optional(),
                Phone: joi.string().max(16).min(6).optional(),
                Email: joi.string().max(256).optional(),
                Gender: joi.string().valid("Male", "Female", "Other").optional(),
                BirthDate: joi.date().iso().optional()
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
                firstName: joi.string().max(64).optional(),
                lastName: joi.string().max(64).optional(),
                gender: joi.string().valid("Male", "Female", "Other").optional(),
                birthDate: joi.date().iso().optional()
            });
            return await schema.validateAsync(query);

        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

}