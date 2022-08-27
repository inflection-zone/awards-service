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
            await this.authorize('Client.Create', request, response);
            const record = await this._delegate.create(request.body);
            const message = 'Client added successfully!';
            ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    getById = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('Client.GetById', request, response);
            const record = await this._delegate.getById(request.params.id);
            const message = 'Client retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    search = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('Client.Search', request, response);
            const searchResults = await this._delegate.search(request.query);
            const message = 'Client records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    update = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('Client.Update', request, response);
            const updatedRecord = await this._delegate.update(request.params.id, request.body);
            const message = 'Client updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('Client.Delete', request, response);
            const result = await this._delegate.delete(request.params.id);
            const message = 'Client deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}