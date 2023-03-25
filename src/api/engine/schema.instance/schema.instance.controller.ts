import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { SchemaInstanceValidator } from './schema.instance.validator';
import { BaseController } from '../../base.controller';
import { SchemaInstanceService } from '../../../database/services/engine/schema.instance.service';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { SchemaInstanceCreateModel, SchemaInstanceSearchFilters, SchemaInstanceUpdateModel } from '../../../domain.types/engine/schema.instance.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SchemaInstanceController extends BaseController {

    //#region member variables and constructors

    _service: SchemaInstanceService = new SchemaInstanceService();

    _validator: SchemaInstanceValidator = new SchemaInstanceValidator();

    constructor() {
        super();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('SchemaInstance.Create', request, response);
            var model: SchemaInstanceCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add schema instance!');
            }
            const message = 'SchemaInstance added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('SchemaInstance.GetById', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            const message = 'SchemaInstance retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('SchemaInstance.Update', request, response);
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: SchemaInstanceUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(id, model);
            const message = 'SchemaInstance updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('SchemaInstance.Search', request, response);
            var filters: SchemaInstanceSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'SchemaInstance records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('SchemaInstance.Delete', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const result = await this._service.delete(id);
            const message = 'SchemaInstance deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
