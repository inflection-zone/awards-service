import {
    EventTypeService
} from '../../database/repository.services/event.type.service';
import {
    ErrorHandler
} from '../../common/error.handler';
import {
    Helper
} from '../../common/helper';
import {
    ApiError
} from '../../common/api.error';
import {
    EventTypeValidator as validator
} from './event.type.validator';
import {
    uuid
} from '../../domain.types/miscellaneous/system.types';
import {
    EventTypeCreateModel,
    EventTypeUpdateModel,
    EventTypeSearchFilters,
    EventTypeSearchResults
} from '../../domain.types/event.type.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class EventTypeControllerDelegate {

    //#region member variables and constructors

    _service: EventTypeService = null;

    constructor() {
        this._service = new EventTypeService();
    }

    //#endregion

    create = async (requestBody: any) => {
        await validator.validateCreateRequest(requestBody);
        var createModel: EventTypeCreateModel = this.getCreateModel(requestBody);
        const record = await this._service.create(createModel);
        if (record === null) {
            throw new ApiError('Unable to create event type!', 400);
        }
        return this.getEnrichedDto(record);
    }

    getById = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Event type with id ' + id.toString() + ' cannot be found!');
        }
        return this.getEnrichedDto(record);
    }

    search = async (query: any) => {
        await validator.validateSearchRequest(query);
        var filters: EventTypeSearchFilters = this.getSearchFilters(query);
        var searchResults: EventTypeSearchResults = await this._service.search(filters);
        var items = searchResults.Items.map(x => this.getSearchDto(x));
        searchResults.Items = items;
        return searchResults;
    }

    update = async (id: uuid, requestBody: any) => {
        await validator.validateUpdateRequest(requestBody);
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Event type with id ' + id.toString() + ' cannot be found!');
        }
        const updateModel: EventTypeUpdateModel = this.getUpdateModel(requestBody);
        const updated = await this._service.update(id, updateModel);
        if (updated == null) {
            throw new ApiError('Unable to update event type!', 400);
        }
        return this.getEnrichedDto(updated);
    }

    delete = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record == null) {
            ErrorHandler.throwNotFoundError('Event type with id ' + id.toString() + ' cannot be found!');
        }
        const eventTypeDeleted: boolean = await this._service.delete(id);
        return {
            Deleted: eventTypeDeleted
        };
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    //#region Privates

    getSearchFilters = (query) => {

        var filters = {};

        var schemeId = query.schemeId ? query.schemeId : null;
        if (schemeId != null) {
            filters['SchemeId'] = schemeId;
        }
        var clientId = query.clientId ? query.clientId : null;
        if (clientId != null) {
            filters['ClientId'] = clientId;
        }
        var name = query.name ? query.name : null;
        if (name != null) {
            filters['Name'] = name;
        }
        var rootRuleNodeId = query.rootRuleNodeId ? query.rootRuleNodeId : null;
        if (rootRuleNodeId != null) {
            filters['RootRuleNodeId'] = rootRuleNodeId;
        }

        return filters;
    }

    getUpdateModel = (requestBody): EventTypeUpdateModel => {

        let updateModel: EventTypeUpdateModel = {};

        if (Helper.hasProperty(requestBody, 'SchemeId')) {
            updateModel.SchemeId = requestBody.SchemeId;
        }
        if (Helper.hasProperty(requestBody, 'ClientId')) {
            updateModel.ClientId = requestBody.ClientId;
        }
        if (Helper.hasProperty(requestBody, 'Name')) {
            updateModel.Name = requestBody.Name;
        }
        if (Helper.hasProperty(requestBody, 'Description')) {
            updateModel.Description = requestBody.Description;
        }
        if (Helper.hasProperty(requestBody, 'RootRuleNodeId')) {
            updateModel.RootRuleNodeId = requestBody.RootRuleNodeId;
        }

        return updateModel;
    }

    getCreateModel = (requestBody): EventTypeCreateModel => {
        return {
            SchemeId: requestBody.SchemeId ? requestBody.SchemeId : null,
            ClientId: requestBody.ClientId ? requestBody.ClientId : null,
            Name: requestBody.Name ? requestBody.Name : null,
            Description: requestBody.Description ? requestBody.Description : null,
            RootRuleNodeId: requestBody.RootRuleNodeId ? requestBody.RootRuleNodeId : null
        };
    }

    getEnrichedDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id: record.id,
            SchemeId: record.SchemeId,
            ClientId: record.ClientId,
            Name: record.Name,
            Description: record.Description,
            RootRuleNodeId: record.RootRuleNodeId
        };
    }

    getSearchDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id: record.id,
            SchemeId: record.SchemeId,
            ClientId: record.ClientId,
            Name: record.Name,
            Description: record.Description,
            RootRuleNodeId: record.RootRuleNodeId
        };
    }

    //#endregion
}
///////////////////////////////////////////////////////////////////////////////////////////////