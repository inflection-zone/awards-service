import express from 'express';
import {
    ResponseHandler
} from '../../common/response.handler';
import {
    ClientControllerDelegate
} from './client.controller.delegate';
import {
    BaseController
} from '../base.controller';
import { ClientApiKeyDto } from '../../domain.types/client.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ClientController extends BaseController {

    //#region member variables and constructors

    _delegate: ClientControllerDelegate = null;

    constructor() {
        super();
        this._delegate = new ClientControllerDelegate();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('ApiClient.Create', request, response);
            const record = await this._delegate.create(request.body);
            const message = 'Api client added successfully!';
            ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('ApiClient.GetById', request, response);
            const record = await this._delegate.getById(request.params.id);
            const message = 'Api client retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('ApiClient.Search', request, response);
            const searchResults = await this._delegate.search(request.query);
            const message = 'Api client records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('ApiClient.Update', request, response);
            const updatedRecord = await this._delegate.update(request.params.id, request.body);
            const message = 'Api client updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('ApiClient.Delete', request, response);
            const result = await this._delegate.delete(request.params.id);
            const message = 'Api client deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getCurrentApiKey = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.authorize('ApiClient.GetApiKey',request, response, false);
            const apiKeyDto = await this._delegate.getCurrentApiKey(request);

            ResponseHandler.success(request, response, 'Client api keys retrieved successfully!', 200, {
                ApiKeyDetails : apiKeyDto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    renewApiKey = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.authorize('ApiClient.RenewApiKey',request, response, false);

            const apiKeyDto: ClientApiKeyDto = await this._delegate.renewApiKey(request);

            ResponseHandler.success(request, response, 'Client api keys renewed successfully!', 200, {
                ApiKeyDetails : apiKeyDto,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
