import express from 'express';
import { Authorizer } from '../auth/authorizer';
import { ErrorHandler } from '../common/handlers/error.handler';
import { Loader } from '../startup/loader';

///////////////////////////////////////////////////////////////////////////////////////

export class BaseController {
   
    _authorizer: Authorizer|null = null;

    constructor() {
        this._authorizer = Loader.Authorizer;
    }

    authorize = async (
        context: string,
        request: express.Request,
        response: express.Response,
        authorize = true) => {

        if (context === undefined || context === null) {
            ErrorHandler.throwInternalServerError('Invalid request context');
        }
        const tokens = context.split('.');
        if (tokens.length < 2) {
            ErrorHandler.throwInternalServerError('Invalid request context');
        }
        const resourceType = tokens[0];
        request.context = context;
        request.resourceType = resourceType;
        if (request.params.id !== undefined && request.params.id !== null) {
            request.resourceId = request.params.id;
        }
        if (authorize) {
            await Loader.Authorizer.authorize(request, response);
        }
    };

}
