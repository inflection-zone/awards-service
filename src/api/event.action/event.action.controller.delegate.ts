import {
    EventActionService
} from '../../database/repository.services/event.action.service';
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
    EventActionValidator as validator
} from './event.action.validator';
import {
    uuid
} from '../../domain.types/miscellaneous/system.types';
import {
    EventActionCreateModel,
    EventActionUpdateModel,
    EventActionSearchFilters,
    EventActionSearchResults
} from '../../domain.types/event.action.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class EventActionControllerDelegate {

    //#region member variables and constructors

    _service: EventActionService = null;

    constructor() {
        this._service = new EventActionService();
    }

    //#endregion

    create = async (requestBody: any) => {
        await validator.validateCreateRequest(requestBody);
        var createModel: EventActionCreateModel = this.getCreateModel(requestBody);
        const record = await this._service.create(createModel);
        if (record === null) {
            throw new ApiError('Unable to create event action!', 400);
        }
        return this.getEnrichedDto(record);
    }

    getById = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Event action with id ' + id.toString() + ' cannot be found!');
        }
        return this.getEnrichedDto(record);
    }

    search = async (query: any) => {
        await validator.validateSearchRequest(query);
        var filters: EventActionSearchFilters = this.getSearchFilters(query);
        var searchResults: EventActionSearchResults = await this._service.search(filters);
        var items = searchResults.Items.map(x => this.getSearchDto(x));
        searchResults.Items = items;
        return searchResults;
    }

    update = async (id: uuid, requestBody: any) => {
        await validator.validateUpdateRequest(requestBody);
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Event action with id ' + id.toString() + ' cannot be found!');
        }
        const updateModel: EventActionUpdateModel = this.getUpdateModel(requestBody);
        const updated = await this._service.update(id, updateModel);
        if (updated == null) {
            throw new ApiError('Unable to update event action!', 400);
        }
        return this.getEnrichedDto(updated);
    }

    delete = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record == null) {
            ErrorHandler.throwNotFoundError('Event action with id ' + id.toString() + ' cannot be found!');
        }
        const eventActionDeleted: boolean = await this._service.delete(id);
        return {
            Deleted: eventActionDeleted
        };
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    //#region Privates

    getSearchFilters = (query) => {

        var filters = {};

        var eventActionTypeId = query.eventActionTypeId ? query.eventActionTypeId : null;
        if (eventActionTypeId != null) {
            filters['EventActionTypeId'] = eventActionTypeId;
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

    getUpdateModel = (requestBody): EventActionUpdateModel => {

        let updateModel: EventActionUpdateModel = {};

        if (Helper.hasProperty(requestBody, 'EventActionTypeId')) {
            updateModel.EventActionTypeId = requestBody.EventActionTypeId;
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

    getCreateModel = (requestBody): EventActionCreateModel => {
        return {
            EventActionTypeId: requestBody.EventActionTypeId ? requestBody.EventActionTypeId : null,
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
            EventActionTypeId: record.EventActionTypeId,
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
            EventActionTypeId: record.EventActionTypeId,
            ParticipantId: record.ParticipantId,
            SchemeId: record.SchemeId,
            Timestamp: record.Timestamp,
            RootRuleNodeId: record.RootRuleNodeId
        };
    }

    //#endregion
}
///////////////////////////////////////////////////////////////////////////////////////////////