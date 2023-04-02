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
            if (this.isArrayOfStrings(errorMessages)) {
                message += ' ' + errorMessages.join(' ');
            }
            else {
                message += ' ' +  errorMessages.toString();
            }
            message = message.split('"').join('');
        }
        throw new ApiError(message, 422);
    };

    static throwDuplicateUserError = (message) => {
        throw new ApiError(message, 422);
    };

    static throwNotFoundError = (message) => {
        throw new ApiError(message, 404);
    };

    static throwUnauthorizedUserError = (message) => {
        throw new ApiError(message, 401);
    };

    static throwForebiddenAccessError = (message) => {
        throw new ApiError(message, 403);
    };

    static throwDbAccessError = (message, error) => {
        throw new ApiError(message, error);
    };

    static throwConflictError = (message) => {
        throw new ApiError(message, 409);
    };

    static throwFailedPreconditionError = (message) => {
        throw new ApiError(message, 412);
    };

    static throwInternalServerError = (message, error = null) => {
        throw new ApiError(message, error);
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

    static isArrayOfStrings = (arr) => {
        return Array.isArray(arr) && arr.every(item => typeof item === 'string');
    }

}
