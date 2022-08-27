import express from 'express';
import {
    ResponseHandler
} from '../../common/response.handler';
import {
    EventActionControllerDelegate
} from './event.action.controller.delegate';
import {
    BaseController
} from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class EventActionController extends BaseController {

    //#region member variables and constructors

    _delegate: EventActionControllerDelegate = null;

    constructor() {
        super();
        this._delegate = new EventActionControllerDelegate();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('EventAction.Create', request, response);
            const record = await this._delegate.create(request.body);
            const message = 'Event action added successfully!';
            ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    getById = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('EventAction.GetById', request, response);
            const record = await this._delegate.getById(request.params.id);
            const message = 'Event action retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    search = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('EventAction.Search', request, response);
            const searchResults = await this._delegate.search(request.query);
            const message = 'Event action records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    update = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('EventAction.Update', request, response);
            const updatedRecord = await this._delegate.update(request.params.id, request.body);
            const message = 'Event action updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('EventAction.Delete', request, response);
            const result = await this._delegate.delete(request.params.id);
            const message = 'Event action deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}