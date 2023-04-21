import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { NodeValidator } from './node.validator';
import { BaseController } from '../../base.controller';
import { NodeService } from '../../../database/services/engine/node.service';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { NodeCreateModel, NodeSearchFilters, NodeUpdateModel } from '../../../domain.types/engine/node.domain.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class NodeController extends BaseController {

    //#region member variables and constructors

    _service: NodeService = new NodeService();

    _validator: NodeValidator = new NodeValidator();

    constructor() {
        super();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Node.Create', request, response);
            var model: NodeCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add node!');
            }
            const message = 'Node added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Node.GetById', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            const message = 'Node retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Node.Update', request, response);
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: NodeUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(id, model);
            const message = 'Node updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Node.Search', request, response);
            var filters: NodeSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Node records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('Node.Delete', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const result = await this._service.delete(id);
            const message = 'Node deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
