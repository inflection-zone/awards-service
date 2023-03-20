import { logger } from '../../logger/logger';

////////////////////////////////////////////////////////////////////////

export class ApiError extends Error {

    Trace: string[] = [];

    Code = 500;

    constructor(message, errorCode, error: Error = null) {
        super();
        this.message = message ?? 'An unexpected error has occurred. ';
        this.message = this.message + (error != null ? '> ' + error.message : '');
        this.Trace = error != null ? error.stack?.split('\n') : [];
        this.Code = errorCode ?? 500;
    }

}

////////////////////////////////////////////////////////////////////////

export class InputValidationError extends Error {

    _errorMessages: string[] = [];

    _httpErrorCode = 422;

    constructor(errorMessages: string[]){
        super();
        this._errorMessages = errorMessages;
        const str = JSON.stringify(this._errorMessages, null, 2);
        this.message = 'Input validation errors: ' + str;
    }

    public get errorMessages() {
        return this._errorMessages;
    }

    public get httpErrorCode() {
        return this._httpErrorCode;
    }

}

////////////////////////////////////////////////////////////////////////

export class ErrorHandler {

    static throwInputValidationError = (errorMessages) => {
        var message = 'Validation error has occurred!\n';
        if (errorMessages) {
            message = message + ' ' + Array.isArray(errorMessages) ? errorMessages.join(' ') : errorMessages.toString();
            message = message.split('"').join('');
        }
        ErrorHandler.throwInternalServerError(message, 422);
    };

    static throwDuplicateUserError = (message) => {
        ErrorHandler.throwInternalServerError(message, 422);
    };

    static throwNotFoundError = (message) => {
        ErrorHandler.throwInternalServerError(message, 404);
    };

    static throwUnauthorizedUserError = (message) => {
        ErrorHandler.throwInternalServerError(message, 401);
    };

    static throwForebiddenAccessError = (message) => {
        ErrorHandler.throwInternalServerError(message, 403);
    };

    static throwDbAccessError = (message, error) => {
        ErrorHandler.throwInternalServerError(message, error);
    };

    static throwConflictError = (message) => {
        ErrorHandler.throwInternalServerError(message, 409);
    };

    static throwFailedPreconditionError = (message) => {
        ErrorHandler.throwInternalServerError(message, 412);
    };

    static throwInternalServerError = (message, error = null) => {
        ErrorHandler.throwInternalServerError(message, error);
    };

    static handleValidationError = (error) => {
        if (error.isJoi === true) {
            logger.error(error.message);
            const errorMessages = error.details.map(x => x.message);
            ErrorHandler.throwInputValidationError(errorMessages);
        }
        else {
            ErrorHandler.throwInputValidationError(error.message);
        }
    };

    static handleValidationError_ExpressValidator = (result) => {
        let index = 1;
        const errorMessages = [];
        for (const er of result.errors) {
            errorMessages.push(` ${index}. ${er.msg} - <${er.value}> for <${er.param}> in ${er.location}`);
            index++;
        }
        ErrorHandler.throwInputValidationError(errorMessages);
    };

}
