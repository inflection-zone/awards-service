import {
    EventActionTypeService
} from '../../database/repository.services/event.action.type.service';
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
    EventActionTypeValidator as validator
} from './event.action.type.validator';
import {
    uuid
} from '../../domain.types/miscellaneous/system.types';
import {
    EventActionTypeCreateModel,
    EventActionTypeUpdateModel,
    EventActionTypeSearchFilters,
    EventActionTypeSearchResults
} from '../../domain.types/event.action.type.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class EventActionTypeControllerDelegate {

    //#region member variables and constructors

    _service: EventActionTypeService = null;

    constructor() {
        this._service = new EventActionTypeService();
    }

    //#endregion

    create = async (requestBody: any) => {
        await validator.validateCreateRequest(requestBody);
        var createModel: EventActionTypeCreateModel = this.getCreateModel(requestBody);
        const record = await this._service.create(createModel);
        if (record === null) {
            throw new ApiError('Unable to create event action type!', 400);
        }
        return this.getEnrichedDto(record);
    }

    getById = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Event action type with id ' + id.toString() + ' cannot be found!');
        }
        return this.getEnrichedDto(record);
    }

    search = async (query: any) => {
        await validator.validateSearchRequest(query);
        var filters: EventActionTypeSearchFilters = this.getSearchFilters(query);
        var searchResults: EventActionTypeSearchResults = await this._service.search(filters);
        var items = searchResults.Items.map(x => this.getSearchDto(x));
        searchResults.Items = items;
        return searchResults;
    }

    update = async (id: uuid, requestBody: any) => {
        await validator.validateUpdateRequest(requestBody);
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Event action type with id ' + id.toString() + ' cannot be found!');
        }
        const updateModel: EventActionTypeUpdateModel = this.getUpdateModel(requestBody);
        const updated = await this._service.update(id, updateModel);
        if (updated == null) {
            throw new ApiError('Unable to update event action type!', 400);
        }
        return this.getEnrichedDto(updated);
    }

    delete = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record == null) {
            ErrorHandler.throwNotFoundError('Event action type with id ' + id.toString() + ' cannot be found!');
        }
        const eventActionTypeDeleted: boolean = await this._service.delete(id);
        return {
            Deleted: eventActionTypeDeleted
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
        var eventId = query.eventId ? query.eventId : null;
        if (eventId != null) {
            filters['EventId'] = eventId;
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

    getUpdateModel = (requestBody): EventActionTypeUpdateModel => {

        let updateModel: EventActionTypeUpdateModel = {};

        if (Helper.hasProperty(requestBody, 'SchemeId')) {
            updateModel.SchemeId = requestBody.SchemeId;
        }
        if (Helper.hasProperty(requestBody, 'EventId')) {
            updateModel.EventId = requestBody.EventId;
        }
        if (Helper.hasProperty(requestBody, 'ClientId')) {
            updateModel.ClientId = requestBody.ClientId;
        }
        if (Helper.hasProperty(requestBody, 'Name')) {
            updateModel.Name = requestBody.Name;
        }
        if (Helper.hasProperty(requestBody, 'RootRuleNodeId')) {
            updateModel.RootRuleNodeId = requestBody.RootRuleNodeId;
        }

        return updateModel;
    }

    getCreateModel = (requestBody): EventActionTypeCreateModel => {
        return {
            SchemeId: requestBody.SchemeId ? requestBody.SchemeId : null,
            EventId: requestBody.EventId ? requestBody.EventId : null,
            ClientId: requestBody.ClientId ? requestBody.ClientId : null,
            Name: requestBody.Name ? requestBody.Name : null,
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
            EventId: record.EventId,
            ClientId: record.ClientId,
            Name: record.Name,
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
            EventId: record.EventId,
            ClientId: record.ClientId,
            Name: record.Name,
            RootRuleNodeId: record.RootRuleNodeId
        };
    }

    //#endregion
}
///////////////////////////////////////////////////////////////////////////////////////////////