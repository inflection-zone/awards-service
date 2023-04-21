import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { IncomingEventTypeValidator } from './incoming.event.type.validator';
import { BaseController } from '../../base.controller';
import { IncomingEventTypeService } from '../../../database/services/engine/incoming.event.type.service';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { IncomingEventTypeCreateModel, IncomingEventTypeSearchFilters, IncomingEventTypeUpdateModel } from '../../../domain.types/engine/incoming.event.type.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class IncomingEventTypeController extends BaseController {

    //#region member variables and constructors

    _service: IncomingEventTypeService = new IncomingEventTypeService();

    _validator: IncomingEventTypeValidator = new IncomingEventTypeValidator();

    constructor() {
        super();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('IncomingEventType.Create', request, response);
            var model: IncomingEventTypeCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add incoming event type!');
            }
            const message = 'Incoming event type added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('IncomingEventType.GetById', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            const message = 'Incoming event type retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('IncomingEventType.Update', request, response);
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: IncomingEventTypeUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(id, model);
            const message = 'Incoming event type updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('IncomingEventType.Search', request, response);
            var filters: IncomingEventTypeSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Incoming event type records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('IncomingEventType.Delete', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const result = await this._service.delete(id);
            const message = 'Incoming event type deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
