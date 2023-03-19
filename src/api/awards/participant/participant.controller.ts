import express from 'express';
import { ResponseHandler } from '../../../common/response.handler';
import { ParticipantValidator } from './participant.validator';
import { BaseController } from '../../base.controller';
import { ParticipantService } from '../../../database/repository.services/awards/participant.service';
import { ErrorHandler } from '../../../common/error.handler';
import { ParticipantCreateModel, ParticipantSearchFilters, ParticipantUpdateModel } from '../../../domain.types/awards/participant.domain.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ParticipantController extends BaseController {

    //#region member variables and constructors

    _service: ParticipantService = null;

    _validator: ParticipantValidator = null;

    constructor() {
        super();
        this._service = new ParticipantService();
        this._validator = new ParticipantValidator();
    }

    //#endregion

    create = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.Create', request, response);
            var model: ParticipantCreateModel = await this._validator.validateCreateRequest(request);
            const record = await this._service.create(model);
            if (record === null) {
                ErrorHandler.throwInternalServerError('Unable to add participant!');
            }
            const message = 'Participant added successfully!';
            return ResponseHandler.success(request, response, message, 201, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    getById = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.GetById', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const record = await this._service.getById(id);
            const message = 'Participant retrieved successfully!';
            return ResponseHandler.success(request, response, message, 200, record);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    update = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.Update', request, response);
            var model: ParticipantUpdateModel = await this._validator.validateUpdateRequest(request);
            const updatedRecord = await this._service.update(model);
            const message = 'Participant updated successfully!';
            ResponseHandler.success(request, response, message, 200, updatedRecord);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    search = async (request: express.Request, response: express.Response) => {
        try {
            await this.authorize('Participant.Search', request, response);
            var filters: ParticipantSearchFilters = await this._validator.validateSearchRequest(request);
            const searchResults = await this._service.search(filters);
            const message = 'Participant records retrieved successfully!';
            ResponseHandler.success(request, response, message, 200, searchResults);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    delete = async (request: express.Request, response: express.Response): Promise < void > => {
        try {
            await this.authorize('Participant.Delete', request, response);
            var id: uuid = await this._validator.validateParamAsUUID(request, 'id');
            const result = await this._service.delete(id);
            const message = 'Participant deleted successfully!';
            ResponseHandler.success(request, response, message, 200, result);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

}
