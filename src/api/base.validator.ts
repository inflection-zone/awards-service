import joi from 'joi';
import express from 'express';
import {
    ErrorHandler
} from '../common/handlers/error.handler';
import { uuid } from '../domain.types/miscellaneous/system.types';
import { DownloadDisposition } from '../domain.types/general/file.resource/file.resource.types';
import { FileResourceMetadata } from '..//domain.types/general/file.resource/file.resource.types';

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

    getByVersionName = async (request: express.Request): Promise<FileResourceMetadata> => {

        var disposition = this.getDownloadDisposition(request);

        var metadata: FileResourceMetadata = {
            ResourceId  : request.params.id,
            Version     : request.params.version,
            Disposition : disposition
        };

        return metadata;
    };

    public getDownloadDisposition(request) {
        var disposition = DownloadDisposition.Auto;
        if (request.query.disposition) {
            if (request.query.disposition === 'inline') {
                disposition = DownloadDisposition.Inline;
            }
            else if (request.query.disposition === 'stream') {
                disposition = DownloadDisposition.Stream;
            }
            else {
                disposition = DownloadDisposition.Attachment;
            }
        }
        return disposition;
    }

}
