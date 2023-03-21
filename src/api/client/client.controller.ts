import express from 'express';
import { generate } from 'generate-password';
import { ResponseHandler } from '../../common/handlers/response.handler';
import { BaseController } from '../base.controller';
import { ClientService } from '../../database/services/client/client.service';
import { ErrorHandler } from '../../common/handlers/error.handler';
import { TypeUtils } from '../../common/utilities/type.utils';
import { ClientValidator } from './client.validator';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import {
    ClientCreateModel,
    ClientUpdateModel,
    ClientSearchFilters,
    ClientSearchResults
} from '../../domain.types/client/client.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ClientController extends BaseController {

    //#region member variables and constructors

    _service: ClientService = new ClientService();

    _validator: ClientValidator = new ClientValidator();

    constructor() {
        super();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('ApiClient.Create', request, response);
            const createModel: ClientCreateModel = await this._validator.validateCreateRequest(request);
            var clientCode = request.body.Code;
            if (clientCode) {
                var existing = await this._service.getByClientCode(clientCode);
                if (existing) {
                    ErrorHandler.throwConflictError(`Client with this client code already exists!`);
                }
            }
            else {
                clientCode = await this.getClientCode(request.body.Name);
                request.body.Code = clientCode;
            }
            const record = await this._service.create(createModel);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to create client!');
            }
            const message = 'Api client added successfully!';
            ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('ApiClient.GetById', request, response);
            const id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (record === null) {
                ErrorHandler.throwNotFoundError('Api client with id ' + id.toString() + ' cannot be found!');
            }
            const message = 'Api client retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('ApiClient.Search', request, response);
            var filters: ClientSearchFilters = await this._validator.validateSearchRequest(request);
            var searchResults: ClientSearchResults = await this._service.search(filters);
            const message = 'Api client records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('ApiClient.Update', request, response);
            const id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const updateModel: ClientUpdateModel = await this._validator.validateUpdateRequest(request);
            const record = await this._service.getById(id);
            if (record === null) {
                ErrorHandler.throwNotFoundError('Api client with id ' + id.toString() + ' cannot be found!');
            }
            const updated = await this._service.update(id, updateModel);
            if (updated == null) {
                ErrorHandler.throwInternalServerError('Unable to update client!');
            }
            const message = 'Api client updated successfully!';
            ResponseHandler.success(request, response, message, 200, updated);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('ApiClient.Delete', request, response);
            const id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            if (record == null) {
                ErrorHandler.throwNotFoundError('Api client with id ' + id.toString() + ' cannot be found!');
            }
            const apiClientDeleted: boolean = await this._service.delete(id);
            const result = {
                Deleted : apiClientDeleted
            };
            const message = 'Api client deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCurrentApiKey = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('ApiClient.GetApiKey',request, response, false);
            const verificationModel = await this._validator.getOrRenewApiKey(request);
            const apiKeyDto = await this._service.getApiKey(verificationModel);
            if (apiKeyDto == null) {
                ErrorHandler.throwInternalServerError('Unable to retrieve client key.');
            }
            ResponseHandler.success(request, response, 'Client api keys retrieved successfully!', 200, {
                ApiKeyDetails : apiKeyDto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    renewApiKey = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('ApiClient.RenewApiKey',request, response, false);
            const verificationModel = await this._validator.getOrRenewApiKey(request);
            if (verificationModel.ValidFrom == null) {
                verificationModel.ValidFrom = new Date();
            }
            if (verificationModel.ValidTill == null) {
                const d = new Date();
                d.setFullYear(d.getFullYear() + 1);
                verificationModel.ValidTill = d;
            }
            const apiKeyDto = await this._service.renewApiKey(verificationModel);
            if (apiKeyDto == null) {
                ErrorHandler.throwInternalServerError('Unable to renew client key.');
            }
            ResponseHandler.success(request, response, 'Client api keys renewed successfully!', 200, {
                ApiKeyDetails : apiKeyDto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    private getClientCodePostfix() {
        return generate({
            length    : 8,
            numbers   : false,
            lowercase : false,
            uppercase : true,
            symbols   : false,
            exclude   : ',-@#$%^&*()',
        });
    }

    private getClientCode = async (clientName: string) => {
        let name = clientName;
        name = name.toUpperCase();
        let cleanedName = '';
        const len = name.length;
        for (let i = 0; i < len; i++) {
            if (TypeUtils.isAlpha(name.charAt(i))) {
                if (!TypeUtils.isAlphaVowel(name.charAt(i))) {
                    cleanedName += name.charAt(i);
                }
            }
        }
        const postfix = this.getClientCodePostfix();
        let tmpCode = cleanedName + postfix;
        tmpCode = tmpCode.substring(0, 8);
        let existing = await this._service.getByClientCode(tmpCode);
        while (existing != null) {
            tmpCode = tmpCode.substring(0, 4);
            tmpCode += this.getClientCodePostfix();
            tmpCode = tmpCode.substring(0, 8);
            existing = await this._service.getByClientCode(tmpCode);
        }
        return tmpCode;
    };

}
