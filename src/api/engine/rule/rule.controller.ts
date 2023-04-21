import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { RuleValidator } from './rule.validator';
import { BaseController } from '../../base.controller';
import { RuleService } from '../../../database/services/engine/rule.service';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { RuleCreateModel, RuleSearchFilters, RuleUpdateModel } from '../../../domain.types/engine/rule.domain.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class RuleController extends BaseController {

    //#region member variables and constructors

    _service: RuleService = new RuleService();

    _validator: RuleValidator = new RuleValidator();

    constructor() {
        super();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Rule.Create', request, response);
            var model: RuleCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add rule!');
            }
            const message = 'Rule added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Rule.GetById', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            const message = 'Rule retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Rule.Update', request, response);
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: RuleUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(id, model);
            const message = 'Rule updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Rule.Search', request, response);
            var filters: RuleSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Rule records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('Rule.Delete', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const result = await this._service.delete(id);
            const message = 'Rule deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
