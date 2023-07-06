import express from 'express';
import { ResponseHandler } from '../../../common/handlers/response.handler';
import { BadgeValidator } from './badge.validator';
import { BaseController } from '../../base.controller';
import { BadgeService } from '../../../database/services/awards/badge.service';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { BadgeCreateModel, BadgeSearchFilters, BadgeUpdateModel } from '../../../domain.types/awards/badge.domain.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { BadgeStockImageService } from '../../../database/services/badge.stock.images/badge.stock.image.service';

///////////////////////////////////////////////////////////////////////////////////////

export class BadgeController extends BaseController {

    //#region member variables and constructors

    _service: BadgeService = new BadgeService();

    _badgeStockservice: BadgeStockImageService = new BadgeStockImageService();

    _validator: BadgeValidator = new BadgeValidator();

    constructor() {
        super();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Badge.Create', request, response);
            var model: BadgeCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add badge!');
            }
            const message = 'Badge added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Badge.GetById', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            const message = 'Badge retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getAll = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Badge.GetAll', request, response, false);
            const records = await this._service.search({});
            const message = 'Badge records with how to earn content retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, records);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Badge.Update', request, response);
            const id = await this._validator.validateParamAsUUID(request, 'id');
            var model: BadgeUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(id, model);
            const message = 'Badge updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Badge.Search', request, response);
            var filters: BadgeSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Badge records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('Badge.Delete', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const result = await this._service.delete(id);
            const message = 'Badge deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getStockBadgeImages = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            await this.authorize('Badge.GetStockBadgeImages',request, response, false);

            const images = await this._badgeStockservice.getAll();
            const message = 'Badge stock images retrieved successfully!';

            ResponseHandler.success(request, response, message, 200, images);

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
