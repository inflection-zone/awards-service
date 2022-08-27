import * as joi from 'joi';
import {
    ErrorHandler
} from '../../common/error.handler';

///////////////////////////////////////////////////////////////////////////////////////////////

export class EventActionTypeValidator {

    static validateCreateRequest = async (requestBody) => {
        try {
            const schema = joi.object({
                SchemeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                EventId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                ClientId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                Name: joi.string().max(256).optional(),
                RootRuleNodeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional()
            });
            return await schema.validateAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

    static validateUpdateRequest = async (requestBody) => {
        try {
            const schema = joi.object({
                SchemeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                EventId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                ClientId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                Name: joi.string().max(256).optional(),
                RootRuleNodeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional()
            });
            return await schema.validateAsync(requestBody);
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

    static validateSearchRequest = async (query) => {
        try {
            const schema = joi.object({
                schemeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                eventId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                clientId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                name: joi.string().max(256).optional(),
                rootRuleNodeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional()
            });
            return await schema.validateAsync(query);

        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    }

}