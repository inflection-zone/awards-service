import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { BadgeCategoryValidator } from './badge.category.validator';
import { BaseController } from '../../base.controller';
import { BadgeCategoryService } from '../../../database/services/awards/badge.category.service';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { BadgeCategoryCreateModel, BadgeCategorySearchFilters, BadgeCategoryUpdateModel } from '../../../domain.types/awards/badge.category.domain.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class BadgeCategoryController extends BaseController {

    //#region member variables and constructors

    _service: BadgeCategoryService = new BadgeCategoryService();

    _validator: BadgeCategoryValidator = new BadgeCategoryValidator();

    constructor() {
        super();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('BadgeCategory.Create', request, response);
            var model: BadgeCategoryCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add badge!');
            }
            const message = 'Badge category added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('BadgeCategory.GetById', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            const message = 'Badge category retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('BadgeCategory.Update', request, response);
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: BadgeCategoryUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(id, model);
            const message = 'Badge category updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('BadgeCategory.Search', request, response);
            var filters: BadgeCategorySearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Badge category records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('BadgeCategory.Delete', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const result = await this._service.delete(id);
            const message = 'Badge category deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
