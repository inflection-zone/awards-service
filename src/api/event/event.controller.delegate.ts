import {
    EventService
} from '../../database/repository.services/event.service';
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
    EventValidator as validator
} from './event.validator';
import {
    uuid
} from '../../domain.types/miscellaneous/system.types';
import {
    EventCreateModel,
    EventUpdateModel,
    EventSearchFilters,
    EventSearchResults
} from '../../domain.types/event.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class EventControllerDelegate {

    //#region member variables and constructors

    _service: EventService = null;

    constructor() {
        this._service = new EventService();
    }

    //#endregion

    create = async (requestBody: any) => {
        await validator.validateCreateRequest(requestBody);
        var createModel: EventCreateModel = this.getCreateModel(requestBody);
        const record = await this._service.create(createModel);
        if (record === null) {
            throw new ApiError('Unable to create event!', 400);
        }
        return this.getEnrichedDto(record);
    }

    getById = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Event with id ' + id.toString() + ' cannot be found!');
        }
        return this.getEnrichedDto(record);
    }

    search = async (query: any) => {
        await validator.validateSearchRequest(query);
        var filters: EventSearchFilters = this.getSearchFilters(query);
        var searchResults: EventSearchResults = await this._service.search(filters);
        var items = searchResults.Items.map(x => this.getSearchDto(x));
        searchResults.Items = items;
        return searchResults;
    }

    update = async (id: uuid, requestBody: any) => {
        await validator.validateUpdateRequest(requestBody);
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Event with id ' + id.toString() + ' cannot be found!');
        }
        const updateModel: EventUpdateModel = this.getUpdateModel(requestBody);
        const updated = await this._service.update(id, updateModel);
        if (updated == null) {
            throw new ApiError('Unable to update event!', 400);
        }
        return this.getEnrichedDto(updated);
    }

    delete = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record == null) {
            ErrorHandler.throwNotFoundError('Event with id ' + id.toString() + ' cannot be found!');
        }
        const eventDeleted: boolean = await this._service.delete(id);
        return {
            Deleted: eventDeleted
        };
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    //#region Privates

    getSearchFilters = (query) => {

        var filters = {};

        var eventTypeId = query.eventTypeId ? query.eventTypeId : null;
        if (eventTypeId != null) {
            filters['EventTypeId'] = eventTypeId;
        }
        var participantId = query.participantId ? query.participantId : null;
        if (participantId != null) {
            filters['ParticipantId'] = participantId;
        }
        var schemeId = query.schemeId ? query.schemeId : null;
        if (schemeId != null) {
            filters['SchemeId'] = schemeId;
        }
        var timestamp = query.timestamp ? query.timestamp : null;
        if (timestamp != null) {
            filters['Timestamp'] = timestamp;
        }
        var rootRuleNodeId = query.rootRuleNodeId ? query.rootRuleNodeId : null;
        if (rootRuleNodeId != null) {
            filters['RootRuleNodeId'] = rootRuleNodeId;
        }

        return filters;
    }

    getUpdateModel = (requestBody): EventUpdateModel => {

        let updateModel: EventUpdateModel = {};

        if (Helper.hasProperty(requestBody, 'EventTypeId')) {
            updateModel.EventTypeId = requestBody.EventTypeId;
        }
        if (Helper.hasProperty(requestBody, 'ParticipantId')) {
            updateModel.ParticipantId = requestBody.ParticipantId;
        }
        if (Helper.hasProperty(requestBody, 'SchemeId')) {
            updateModel.SchemeId = requestBody.SchemeId;
        }
        if (Helper.hasProperty(requestBody, 'RootRuleNodeId')) {
            updateModel.RootRuleNodeId = requestBody.RootRuleNodeId;
        }

        return updateModel;
    }

    getCreateModel = (requestBody): EventCreateModel => {
        return {
            EventTypeId: requestBody.EventTypeId ? requestBody.EventTypeId : null,
            ParticipantId: requestBody.ParticipantId ? requestBody.ParticipantId : null,
            SchemeId: requestBody.SchemeId ? requestBody.SchemeId : null,
            RootRuleNodeId: requestBody.RootRuleNodeId ? requestBody.RootRuleNodeId : null
        };
    }

    getEnrichedDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id: record.id,
            EventTypeId: record.EventTypeId,
            ParticipantId: record.ParticipantId,
            SchemeId: record.SchemeId,
            Timestamp: record.Timestamp,
            RootRuleNodeId: record.RootRuleNodeId
        };
    }

    getSearchDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id: record.id,
            EventTypeId: record.EventTypeId,
            ParticipantId: record.ParticipantId,
            SchemeId: record.SchemeId,
            Timestamp: record.Timestamp,
            RootRuleNodeId: record.RootRuleNodeId
        };
    }

    //#endregion
}
///////////////////////////////////////////////////////////////////////////////////////////////