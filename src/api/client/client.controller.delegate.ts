import {
    ClientService
} from '../../database/repository.services/client.service';
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
    ClientValidator as validator
} from './client.validator';
import {
    uuid
} from '../../domain.types/miscellaneous/system.types';
import {
    ClientCreateModel,
    ClientUpdateModel,
    ClientSearchFilters,
    ClientSearchResults
} from '../../domain.types/client.domain.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ClientControllerDelegate {

    //#region member variables and constructors

    _service: ClientService = null;

    constructor() {
        this._service = new ClientService();
    }

    //#endregion

    create = async (requestBody: any) => {
        await validator.validateCreateRequest(requestBody);
        var createModel: ClientCreateModel = this.getCreateModel(requestBody);
        const record = await this._service.create(createModel);
        if (record === null) {
            throw new ApiError('Unable to create client!', 400);
        }
        return this.getEnrichedDto(record);
    }

    getById = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Client with id ' + id.toString() + ' cannot be found!');
        }
        return this.getEnrichedDto(record);
    }

    search = async (query: any) => {
        await validator.validateSearchRequest(query);
        var filters: ClientSearchFilters = this.getSearchFilters(query);
        var searchResults: ClientSearchResults = await this._service.search(filters);
        var items = searchResults.Items.map(x => this.getSearchDto(x));
        searchResults.Items = items;
        return searchResults;
    }

    update = async (id: uuid, requestBody: any) => {
        await validator.validateUpdateRequest(requestBody);
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Client with id ' + id.toString() + ' cannot be found!');
        }
        const updateModel: ClientUpdateModel = this.getUpdateModel(requestBody);
        const updated = await this._service.update(id, updateModel);
        if (updated == null) {
            throw new ApiError('Unable to update client!', 400);
        }
        return this.getEnrichedDto(updated);
    }

    delete = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record == null) {
            ErrorHandler.throwNotFoundError('Client with id ' + id.toString() + ' cannot be found!');
        }
        const clientDeleted: boolean = await this._service.delete(id);
        return {
            Deleted: clientDeleted
        };
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////

    //#region Privates

    getSearchFilters = (query) => {

        var filters = {};

        var clientName = query.clientName ? query.clientName : null;
        if (clientName != null) {
            filters['ClientName'] = clientName;
        }
        var clientCode = query.clientCode ? query.clientCode : null;
        if (clientCode != null) {
            filters['ClientCode'] = clientCode;
        }

        return filters;
    }

    getUpdateModel = (requestBody): ClientUpdateModel => {

        let updateModel: ClientUpdateModel = {};

        if (Helper.hasProperty(requestBody, 'ClientName')) {
            updateModel.ClientName = requestBody.ClientName;
        }
        if (Helper.hasProperty(requestBody, 'ClientCode')) {
            updateModel.ClientCode = requestBody.ClientCode;
        }
        if (Helper.hasProperty(requestBody, 'Phone')) {
            updateModel.Phone = requestBody.Phone;
        }
        if (Helper.hasProperty(requestBody, 'Email')) {
            updateModel.Email = requestBody.Email;
        }

        return updateModel;
    }

    getCreateModel = (requestBody): ClientCreateModel => {
        return {
            ClientName: requestBody.ClientName ? requestBody.ClientName : null,
            ClientCode: requestBody.ClientCode ? requestBody.ClientCode : null,
            Phone: requestBody.Phone ? requestBody.Phone : null,
            Email: requestBody.Email ? requestBody.Email : null
        };
    }

    getEnrichedDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id: record.id,
            ClientName: record.ClientName,
            ClientCode: record.ClientCode,
            Phone: record.Phone,
            Email: record.Email
        };
    }

    getSearchDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id: record.id,
            ClientName: record.ClientName,
            ClientCode: record.ClientCode,
            Phone: record.Phone,
            Email: record.Email
        };
    }

    //#endregion
}
///////////////////////////////////////////////////////////////////////////////////////////////