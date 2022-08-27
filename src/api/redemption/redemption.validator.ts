import * as joi from 'joi';
import {
    ErrorHandler
} from '../../common/error.handler';

///////////////////////////////////////////////////////////////////////////////////////////////

export class RedemptionValidator {

    static validateCreateRequest = async (requestBody) => {
        try {
            const schema = joi.object({
                ClientId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                SchemeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                ParticipantId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                Name: joi.string().max(256).optional(),
                Description: joi.string().max(512).optional(),
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
                ClientId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                SchemeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                ParticipantId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                Name: joi.string().max(256).optional(),
                Description: joi.string().max(512).optional(),
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
                clientId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                schemeId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                participantId: joi.string().guid({
                    version: ['uuidv4']
                }).optional(),
                name: joi.string().max(256).optional(),
                redemptionDate: joi.date().iso().optional(),
                redemptionStatus: joi.string().max(512).optional(),
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