import joi from 'joi';
import express from 'express';
import {
    ErrorHandler
} from '../common/handlers/error.handler';
import { uuid } from '../domain.types/miscellaneous/system.types';

//////////////////////////////////////////////////////////////////

export default class BaseValidator {

    public validateParamAsUUID = async (request: express.Request, paramName: string): Promise<uuid> => {
        try {
            const schema = joi.string().uuid({version: 'uuidv4'}).required();
            const param = request.params[paramName];
            await schema.validateAsync(param);
            return request.params[paramName];
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

}
