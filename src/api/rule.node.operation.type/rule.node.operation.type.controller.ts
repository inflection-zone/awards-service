import express from 'express';
import {
    ResponseHandler
} from '../../common/response.handler';
import {
    RuleNodeOperationTypeControllerDelegate
} from './rule.node.operation.type.controller.delegate';
import {
    BaseController
} from '../base.controller';

///////////////////////////////////////////////////////////////////////////////////////

export class RuleNodeOperationTypeController extends BaseController {

    //#region member variables and constructors

    _delegate: RuleNodeOperationTypeControllerDelegate = null;

    constructor() {
        super();
        this._delegate = new RuleNodeOperationTypeControllerDelegate();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('RuleNodeOperationType.Create', request, response);
            const record = await this._delegate.create(request.body);
            const message = 'Rule node operation type added successfully!';
            ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    getById = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('RuleNodeOperationType.GetById', request, response);
            const record = await this._delegate.getById(request.params.id);
            const message = 'Rule node operation type retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    search = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('RuleNodeOperationType.Search', request, response);
            const searchResults = await this._delegate.search(request.query);
            const message = 'Rule node operation type records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    update = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('RuleNodeOperationType.Update', request, response);
            const updatedRecord = await this._delegate.update(request.params.id, request.body);
            const message = 'Rule node operation type updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('RuleNodeOperationType.Delete', request, response);
            const result = await this._delegate.delete(request.params.id);
            const message = 'Rule node operation type deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}