import {
    ClientService
} from '../../database/repository.services/client/client.service';
import {
    ErrorHandler
} from '../../common/handlers/error.handler';
import {
    TypeUtils
} from '../../common/utilities/type.utils';
import {
    ApiError
} from '../../common/handlers/error.handler';
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
} from '../../domain.types/client/client.domain.types';
import { generate } from 'generate-password';

///////////////////////////////////////////////////////////////////////////////////////

export class ClientControllerDelegate {

    //#region member variables and constructors

    _service: ClientService = null;

    constructor() {
        this._service = new ClientService();
    }

    //#endregion

    create = async (requestBody: any) => {
        const createModel: ClientCreateModel = await validator.validateCreateRequest(requestBody);
        var clientCode = requestBody.Code;
        if (clientCode) {
            var existing = await this._service.getByClientCode(clientCode);
            if (existing) {
                ErrorHandler.throwConflictError(`Client with this client code already exists!`);
            }
        }
        else {
            clientCode = await this.getClientCode(requestBody.Name);
            requestBody.Code = clientCode;
        }
        const record = await this._service.create(createModel);
        if (record === null) {
            throw new ApiError('Unable to create client!', 400);
        }
        return this.getEnrichedDto(record);
    };

    getById = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Api client with id ' + id.toString() + ' cannot be found!');
        }
        return this.getEnrichedDto(record);
    };

    search = async (query: any) => {
        var filters: ClientSearchFilters = await validator.validateSearchRequest(query);
        var searchResults: ClientSearchResults = await this._service.search(filters);
        return searchResults;
    };

    update = async (id: uuid, requestBody: any) => {
        await validator.validateUpdateRequest(requestBody);
        const record = await this._service.getById(id);
        if (record === null) {
            ErrorHandler.throwNotFoundError('Api client with id ' + id.toString() + ' cannot be found!');
        }
        const updateModel: ClientUpdateModel = this.getUpdateModel(requestBody);
        const updated = await this._service.update(id, updateModel);
        if (updated == null) {
            throw new ApiError('Unable to update client!', 400);
        }
        return this.getEnrichedDto(updated);
    };

    delete = async (id: uuid) => {
        const record = await this._service.getById(id);
        if (record == null) {
            ErrorHandler.throwNotFoundError('Api client with id ' + id.toString() + ' cannot be found!');
        }
        const apiClientDeleted: boolean = await this._service.delete(id);
        return {
            Deleted : apiClientDeleted
        };
    };

    getCurrentApiKey = async (request) => {
        const verificationModel = await validator.getOrRenewApiKey(request);
        const apiKeyDto = await this._service.getApiKey(verificationModel);
        if (apiKeyDto == null) {
            throw new ApiError('Unable to retrieve client key.', 400);
        }
        return apiKeyDto;
    };

    renewApiKey = async (request) => {

        const verificationModel = await validator.getOrRenewApiKey(request);

        if (verificationModel.ValidFrom == null) {
            verificationModel.ValidFrom = new Date();
        }
        if (verificationModel.ValidTill == null) {
            const d = new Date();
            d.setFullYear(d.getFullYear() + 1);
            verificationModel.ValidTill = d;
        }

        const apiKeyDto = await this._service.renewApiKey(verificationModel);
        if (apiKeyDto == null) {
            throw new ApiError('Unable to renew client key.', 400);
        }
        return apiKeyDto;
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////

    //#region Privates

    getUpdateModel = (requestBody): ClientUpdateModel => {

        const updateModel: ClientUpdateModel = {};

        if (TypeUtils.hasProperty(requestBody, 'Name')) {
            updateModel.Name = requestBody.Name;
        }
        if (TypeUtils.hasProperty(requestBody, 'IsPrivileged')) {
            updateModel.IsPrivileged = requestBody.IsPrivileged;
        }
        if (TypeUtils.hasProperty(requestBody, 'CountryCode')) {
            updateModel.CountryCode = requestBody.CountryCode;
        }
        if (TypeUtils.hasProperty(requestBody, 'Phone')) {
            updateModel.Phone = requestBody.Phone;
        }
        if (TypeUtils.hasProperty(requestBody, 'Email')) {
            updateModel.Email = requestBody.Email;
        }
        if (TypeUtils.hasProperty(requestBody, 'Password')) {
            updateModel.Password = requestBody.Password;
        }
        if (TypeUtils.hasProperty(requestBody, 'ApiKey')) {
            updateModel.ApiKey = requestBody.ApiKey;
        }
        if (TypeUtils.hasProperty(requestBody, 'ValidFrom')) {
            updateModel.ValidFrom = requestBody.ValidFrom;
        }
        if (TypeUtils.hasProperty(requestBody, 'ValidTill')) {
            updateModel.ValidTill = requestBody.ValidTill;
        }

        return updateModel;
    };

    getEnrichedDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id           : record.id,
            Name         : record.Name,
            Code         : record.Code,
            IsPrivileged : record.IsPrivileged,
            IsActive     : record.IsActive,
            CountryCode  : record.CountryCode,
            Phone        : record.Phone,
            Email        : record.Email,
            ValidFrom    : record.ValidFrom,
            ValidTill    : record.ValidTill
        };
    };

    getSearchDto = (record) => {
        if (record == null) {
            return null;
        }
        return {
            id                  : record.id,
            Name                : record.Name,
            Code                : record.Code,
            ClientInterfaceType : record.ClientInterfaceType,
            IsPrivileged        : record.IsPrivileged,
            CountryCode         : record.CountryCode,
            Phone               : record.Phone,
            Email               : record.Email,
            ValidFrom           : record.ValidFrom,
            ValidTill           : record.ValidTill,
            IsActive            : record.IsActive
        };
    };

    private getClientCodePostfix() {
        return generate({
            length    : 8,
            numbers   : false,
            lowercase : false,
            uppercase : true,
            symbols   : false,
            exclude   : ',-@#$%^&*()',
        });
    }

    private getClientCode = async (clientName: string) => {
        let name = clientName;
        name = name.toUpperCase();
        let cleanedName = '';
        const len = name.length;
        for (let i = 0; i < len; i++) {
            if (TypeUtils.isAlpha(name.charAt(i))) {
                if (!TypeUtils.isAlphaVowel(name.charAt(i))) {
                    cleanedName += name.charAt(i);
                }
            }
        }
        const postfix = this.getClientCodePostfix();
        let tmpCode = cleanedName + postfix;
        tmpCode = tmpCode.substring(0, 8);
        let existing = await this._service.getByClientCode(tmpCode);
        while (existing != null) {
            tmpCode = tmpCode.substring(0, 4);
            tmpCode += this.getClientCodePostfix();
            tmpCode = tmpCode.substring(0, 8);
            existing = await this._service.getByClientCode(tmpCode);
        }
        return tmpCode;
    };

    //#endregion

}
///////////////////////////////////////////////////////////////////////////////////////////////
