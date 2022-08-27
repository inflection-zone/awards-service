import * as joi from 'joi';
import {
    ErrorHandler
} from '../../common/error.handler';

///////////////////////////////////////////////////////////////////////////////////////////////

export class EventValidator {

    static validateCreateRequest = async (requestBody) => {
        try {
            const schema = joi.object({
                EventTypeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                ParticipantId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                SchemeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
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
                EventTypeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                ParticipantId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                SchemeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
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
                eventTypeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                participantId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                schemeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                timestamp: joi.date().iso().optional(),
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