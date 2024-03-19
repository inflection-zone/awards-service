import express from 'express';
import fs from 'fs';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { FileResourceService } from '../../../database/services/general/file.resource.service';
import { BaseController } from '../../base.controller';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ApiError, ErrorHandler } from '../../../common/handlers/error.handler';
import BaseValidator from '../../base.validator';
import * as mime from 'mime-types';
import { FileResourceCreateModel } from '../../../domain.types/general/file.resource.domain.types';
import { FileUtils } from '../../../common/utilities/file.utils';
import { Loader } from '../../../startup/loader';
import { StorageService } from '../../../modules/storage/storage.service';
import { FileResourceMetadata } from '../../../domain.types/general/file.resource/file.resource.types';
import { Authenticator } from '../../../auth/authenticator';
import path from 'path';
import { Helper } from '../../../common/helper';
import { DownloadDisposition } from '../../../domain.types/general/file.resource/file.resource.types';

///////////////////////////////////////////////////////////////////////////////////////

export class FileResourceController extends BaseController {

    //#region member variables and constructors
    _service: FileResourceService = null;

    _storageService: StorageService = Loader.Container.resolve(StorageService);

    _validator: BaseValidator = new BaseValidator();

    _authenticator: Authenticator = null;


    constructor() {
        super();
        this._service = new FileResourceService();
        this._authenticator = Loader.Authenticator;

    }

    //#endregion

    upload = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('FileResource.Upload', request, response);

            var dateFolder = new Date().toISOString().split('T')[0];
            var originalFilename: string = request.headers['filename'] as string;
            var contentLength = request.headers['content-length'];
            var mimeType = request.headers['mime-type'] ?? mime.lookup(originalFilename);
            var publicResource = request.headers['public'] === 'true' ? true : false;

            var timestamp = new Date().getTime().toString();
            var ext = FileUtils.getFileExtension(originalFilename);
            var filename = originalFilename.replace('.' + ext, "");
            filename = filename.replace(' ', "_");
            filename = filename + '_' + timestamp + '.' + ext;
            var storageKey = 'uploaded/' + dateFolder + '/' + filename;

            var key = await this._storageService.upload(storageKey, request);
            if (!key) {
                ErrorHandler.throwInternalServerError(`Unable to upload the file!`);
            }
            var model: FileResourceCreateModel = {
                StorageKey       : storageKey,
                MimeType         : mimeType as string,
                Public           : publicResource,
                OriginalFilename : originalFilename,
                Tags             : request.body.Tags ? request.body.Tags : [],
                Size             : contentLength ? parseInt(contentLength) : null,
                UserId           : request.currentUser ? request.currentUser.UserId : null,
            };
            var record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to create file resource!', 400);
            }            

            const message = 'File resource uploaded successfully!';
            ResponseHandler.success(request, response, message, 201, record);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    download = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (!record.Public) {
                var verified = await Loader.Authenticator.verifyUser(request);
                if (!verified) {
                    ErrorHandler.throwUnauthorizedUserError('User is not authorized to download the resource!');
                }
                await this.authorize('FileResource.Download', request, response);
            }
            var disposition = request.query.disposition as string;
            if (!disposition) {
                disposition = 'inline';
            }

            var storageKey = record.StorageKey;
            var originalFilename = record.OriginalFilename;
            var mimeType = mime.lookup(originalFilename);

            response.setHeader('Content-type', mimeType as string);
            this.setResponseHeaders(response, originalFilename, disposition);

            var readStream = await this._storageService.download(storageKey, '');
            if (!readStream) {
                ErrorHandler.throwInternalServerError(`Unable to download the file!`);
            }

            readStream.pipe(response);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    getById = async (request: express.Request, response: express.Response): Promise <void> => {
        try {
            await this.authorize('FileResource.GetById', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (record === null) {
                ErrorHandler.throwNotFoundError('File resource with id ' + id.toString() + ' cannot be found!');
            }
            const message = 'File resource retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('FileResource.Delete', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            var success = await this._storageService.delete(request.params.id);
            if (!success) {
                ErrorHandler.throwInternalServerError('File resource with id ' + id.toString() + ' cannot be deleted!');
            }
            success = await this._service.delete(request.params.id);
            if (!success) {
                ErrorHandler.throwInternalServerError('File resource with id ' + id.toString() + ' cannot be deleted!');
            }
            const message = 'File resource deleted successfully!';
            ResponseHandler.success(request, response, message, 200, {
                Deleted: success
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    //#region Privates

    setResponseHeaders = (response: express.Response, filename: string, disposition = 'inline') => {
        if (disposition === 'inline') {
            response.setHeader('Content-disposition', 'inline');
        }
        else {
            response.setHeader('Content-disposition', 'attachment;filename=' + filename);
        }
    };

    DownloadByVersion = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'FileResource.DownloadByVersion';
            const metadata = await this._validator.getByVersionName(request);
            var resource = await this._service.getById(metadata.ResourceId);

            if (resource.Public === false) {

                //NOTE: Please note that this is deviation from regular pattern of
                //authentication middleware pipeline. Here we are authenticating client
                //and user only when the file resource is not public.

                await this._authenticator.checkAuthentication(request);
                await this._authorizer.authorize(request, response);
            }

            console.log(`Download request for Resource Id:: ${metadata.ResourceId}
                and Version:: ${metadata.Version}`);
            const localDestination = await this._service.DownloadByVersion(
                metadata.ResourceId,
                metadata.Version);

            this.streamToResponse(localDestination, response, metadata);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private streamToResponse(
        localDestination: string,
        response: express.Response<any, Record<string, any>>,
        metadata: FileResourceMetadata) {

        if (localDestination == null) {
            throw new ApiError(404, 'File resource not found.');
        }

        var filename = path.basename(localDestination);
        var mimetype = metadata.MimeType ?? Helper.getMimeType(localDestination);
        if (!mimetype) {
            mimetype = 'text/plain';
        }

        this.setDownloadResponseHeaders(response, metadata.Disposition, mimetype, filename);

        var filestream = fs.createReadStream(localDestination);
        filestream.pipe(response);
    };

    private setDownloadResponseHeaders(
        response: express.Response,
        disposition: DownloadDisposition,
        mimeType: string,
        filename: string) {

        response.setHeader('Content-type', mimeType);

        if (disposition === DownloadDisposition.Attachment) {
            response.setHeader('Content-disposition', 'attachment; filename=' + filename);
        }
        else if (disposition === DownloadDisposition.Inline ||
            (mimeType === 'image/jpeg' ||
            mimeType === 'image/png' ||
            mimeType === 'image/bmp')) {
            response.setHeader('Content-disposition', 'inline');
        }
        else {
            response.setHeader('Content-disposition', 'attachment; filename=' + filename);
        }

    }

    //#endregion

}
