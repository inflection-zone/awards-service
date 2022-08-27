import express from 'express';
import {
    ResponseHandler
} from '../../common/response.handler';
import {
    EventActionTypeControllerDelegate
} from './event.action.type.controller.delegate';
import {
    BaseController
} from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class EventActionTypeController extends BaseController {

    //#region member variables and constructors

    _delegate: EventActionTypeControllerDelegate = null;

    constructor() {
        super();
        this._delegate = new EventActionTypeControllerDelegate();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('EventActionType.Create', request, response);
            const record = await this._delegate.create(request.body);
            const message = 'Event action type added successfully!';
            ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    getById = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('EventActionType.GetById', request, response);
            const record = await this._delegate.getById(request.params.id);
            const message = 'Event action type retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    search = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('EventActionType.Search', request, response);
            const searchResults = await this._delegate.search(request.query);
            const message = 'Event action type records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    update = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('EventActionType.Update', request, response);
            const updatedRecord = await this._delegate.update(request.params.id, request.body);
            const message = 'Event action type updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('EventActionType.Delete', request, response);
            const result = await this._delegate.delete(request.params.id);
            const message = 'Event action type deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}