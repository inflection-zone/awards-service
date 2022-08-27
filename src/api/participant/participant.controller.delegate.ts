import {
    ParticipantService
} from '../../database/repository.services/participant.service';
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
    ParticipantValidator as validator
} from './participant.validator';
import {
    uuid
} from '../../domain.types/miscellaneous/system.types';
import {
    ParticipantCreateModel,
    ParticipantUpdateModel,
    ParticipantSearchFilters,
    ParticipantSearchResults
} from '../../domain.types/participant.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ParticipantControllerDelegate {

    //#region member variables and constructors

    _service: ParticipantService = null;

    constructor() {
        this._service = new ParticipantService();
    }

    //#endregion

    create = async (requestBody: any) => {
        await validator.validateCreateRequest(requestBody);
        var createModel: ParticipantCreateModel = this.getCreateModel(requestBody);
        const record = await this._service.create(createModel);
        if (record === null) {
            throw new ApiError('Unable to create participant!', 400);
        }
        return this.getEnrichedDto(record);
    }

    getById = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Participant with id ' + id.toString() + ' cannot be found!');
        }
        return this.getEnrichedDto(record);
    }

    search = async (query: any) => {
        await validator.validateSearchRequest(query);
        var filters: ParticipantSearchFilters = this.getSearchFilters(query);
        var searchResults: ParticipantSearchResults = await this._service.search(filters);
        var items = searchResults.Items.map(x => this.getSearchDto(x));
        searchResults.Items = items;
        return searchResults;
    }

    update = async (id: uuid, requestBody: any) => {
        await validator.validateUpdateRequest(requestBody);
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Participant with id ' + id.toString() + ' cannot be found!');
        }
        const updateModel: ParticipantUpdateModel = this.getUpdateModel(requestBody);
        const updated = await this._service.update(id, updateModel);
        if (updated == null) {
            throw new ApiError('Unable to update participant!', 400);
        }
        return this.getEnrichedDto(updated);
    }

    delete = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record == null) {
            ErrorHandler.throwNotFoundError('Participant with id ' + id.toString() + ' cannot be found!');
        }
        const participantDeleted: boolean = await this._service.delete(id);
        return {
            Deleted: participantDeleted
        };
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    //#region Privates

    getSearchFilters = (query) => {

        var filters = {};

        var clientId = query.clientId ? query.clientId : null;
        if (clientId != null) {
            filters['ClientId'] = clientId;
        }
        var firstName = query.firstName ? query.firstName : null;
        if (firstName != null) {
            filters['FirstName'] = firstName;
        }
        var lastName = query.lastName ? query.lastName : null;
        if (lastName != null) {
            filters['LastName'] = lastName;
        }
        var gender = query.gender ? query.gender : null;
        if (gender != null) {
            filters['Gender'] = gender;
        }
        var birthDate = query.birthDate ? query.birthDate : null;
        if (birthDate != null) {
            filters['BirthDate'] = birthDate;
        }

        return filters;
    }

    getUpdateModel = (requestBody): ParticipantUpdateModel => {

        let updateModel: ParticipantUpdateModel = {};

        if (Helper.hasProperty(requestBody, 'ClientId')) {
            updateModel.ClientId = requestBody.ClientId;
        }
        if (Helper.hasProperty(requestBody, 'FirstName')) {
            updateModel.FirstName = requestBody.FirstName;
        }
        if (Helper.hasProperty(requestBody, 'LastName')) {
            updateModel.LastName = requestBody.LastName;
        }
        if (Helper.hasProperty(requestBody, 'Phone')) {
            updateModel.Phone = requestBody.Phone;
        }
        if (Helper.hasProperty(requestBody, 'Email')) {
            updateModel.Email = requestBody.Email;
        }
        if (Helper.hasProperty(requestBody, 'Gender')) {
            updateModel.Gender = requestBody.Gender;
        }
        if (Helper.hasProperty(requestBody, 'BirthDate')) {
            updateModel.BirthDate = requestBody.BirthDate;
        }

        return updateModel;
    }

    getCreateModel = (requestBody): ParticipantCreateModel => {
        return {
            ClientId: requestBody.ClientId ? requestBody.ClientId : null,
            FirstName: requestBody.FirstName ? requestBody.FirstName : null,
            LastName: requestBody.LastName ? requestBody.LastName : null,
            Phone: requestBody.Phone ? requestBody.Phone : null,
            Email: requestBody.Email ? requestBody.Email : null,
            Gender: requestBody.Gender ? requestBody.Gender : 'Male',
            BirthDate: requestBody.BirthDate ? requestBody.BirthDate : null
        };
    }

    getEnrichedDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id: record.id,
            ClientId: record.ClientId,
            FirstName: record.FirstName,
            LastName: record.LastName,
            Phone: record.Phone,
            Email: record.Email,
            Gender: record.Gender,
            BirthDate: record.BirthDate
        };
    }

    getSearchDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id: record.id,
            ClientId: record.ClientId,
            FirstName: record.FirstName,
            LastName: record.LastName,
            Phone: record.Phone,
            Email: record.Email,
            Gender: record.Gender,
            BirthDate: record.BirthDate
        };
    }

    //#endregion
}
///////////////////////////////////////////////////////////////////////////////////////////////