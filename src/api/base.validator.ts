import z from 'zod';
import express from 'express';
import {
    ErrorHandler
} from '../common/error.handler';
import { uuid } from '../domain.types/miscellaneous/system.types';

//////////////////////////////////////////////////////////////////

export default class BaseValidator {

    public validateParamAsUUID = async (request: express.Request, paramName: string): Promise<uuid> => {
        try {
            const schema = z.string({
                invalid_type_error : 'Parameter data type should UUID.'
            }).uuid();
            const parsed = await schema.parseAsync(request.params[paramName]);
            return parsed;
        } catch (error) {
            ErrorHandler.handleValidationError(error);
        }
    };

}
