import { Client } from '../../models/client/client.model';
import { ClientCreateModel, ClientResponseDto, ClientSearchFilters, ClientSearchResults, ClientUpdateModel, ClientVerificationModel, ClientApiKeyResponseDto } from '../../../domain.types/client/client.domain.types';
import { logger } from '../../../logger/logger';
import { CurrentClient } from '../../../domain.types/miscellaneous/current.client';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Helper } from '../../../common/helper';
import * as apikeyGenerator from 'uuid-apikey';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, LessThanOrEqual, Like, MoreThanOrEqual, Repository } from 'typeorm';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ClientMapper } from '../../mappers/client/client.mapper';
import { StringUtils } from '../../../common/utilities/string.utils';

///////////////////////////////////////////////////////////////////////

export class ClientService {

    //#region Repositories

    _clientRepository: Repository<Client> = Source.getRepository(Client);

    //#endregion

    public create = async (createModel: ClientCreateModel): Promise<ClientResponseDto> => {
        try {
            const password = createModel.Password ?? 'Test@123';
            const client = this._clientRepository.create({
                Name         : createModel.Name,
                Code         : createModel.Code,
                IsPrivileged : createModel.IsPrivileged,
                CountryCode  : createModel.CountryCode,
                Phone        : createModel.Phone,
                Email        : createModel.Email,
                Password     : StringUtils.hash(password),
                ApiKey       : createModel.ApiKey ?? apikeyGenerator.default.create().apiKey,
                ValidFrom    : createModel.ValidFrom ?? null,
                ValidTill    : createModel.ValidTill ?? null,
            });
            var record = await this._clientRepository.save(client);
            return ClientMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getById = async (id: uuid): Promise<ClientResponseDto> => {
        try {
            var client = await this._clientRepository.findOne({
                where : {
                    id : id
                }
            });
            return ClientMapper.toResponseDto(client);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: ClientSearchFilters): Promise<ClientSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._clientRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => ClientMapper.toSearchResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public getByClientCode = async (clientCode: string): Promise<ClientResponseDto> =>{
        try {
            var client = await this._clientRepository.findOne({
                where : {
                    Code : clientCode
                }
            });
            return ClientMapper.toResponseDto(client);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to get client record!', error);
        }
    };

    public getApiKeyByClientCode = async (clientCode: string): Promise<ClientApiKeyResponseDto> =>{
        try {
            const client = await this._clientRepository.findOne({
                where : {
                    Code : clientCode
                }
            });
            return ClientMapper.toClientSecretsResponseDto(client);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getClientHashedPassword = async(id: uuid): Promise<string> => {
        try {
            const client = await this._clientRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!client) {
                ErrorHandler.throwNotFoundError('client not found!');
            }
            return client.Password;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getApiKey = async(verificationModel: ClientVerificationModel): Promise<ClientApiKeyResponseDto> => {
        try {
            const apiKeyDto = await this.getApiKeyByClientCode(verificationModel.Code);
            if (apiKeyDto == null) {
                const message = 'Client does not exist with code (' + verificationModel.Code + ')';
                ErrorHandler.throwInternalServerError(message, 404);
            }

            const hashedPassword = await this.getClientHashedPassword(apiKeyDto.id);
            const isPasswordValid = StringUtils.compareHashedPassword(verificationModel.Password, hashedPassword);
            if (!isPasswordValid) {
                ErrorHandler.throwInternalServerError('Invalid password!', 401);
            }
            const client = await this._clientRepository.findOne({
                where : {
                    id : apiKeyDto.id
                }
            });
            return await ClientMapper.toClientSecretsResponseDto(client);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public renewApiKey = async (verificationModel: ClientVerificationModel): Promise<ClientApiKeyResponseDto> => {

        const client = await this.getByClientCode(verificationModel.Code);
        if (client == null) {
            const message = 'Client does not exist for client code (' + verificationModel.Code + ')';
            ErrorHandler.throwInternalServerError(message, 404);
        }

        const hashedPassword = await this.getClientHashedPassword(client.id);
        const isPasswordValid = StringUtils.compareHashedPassword(verificationModel.Password, hashedPassword);
        if (!isPasswordValid) {
            ErrorHandler.throwInternalServerError('Invalid password!', 401);
        }

        const key = apikeyGenerator.default.create();
        const clientApiKeyDto = await this.setApiKey(
            client.id,
            key.apiKey,
            verificationModel.ValidFrom,
            verificationModel.ValidTill
        );

        return clientApiKeyDto;
    };

    public setApiKey = async(id: string, apiKey: string, validFrom: Date, validTill: Date)
        : Promise<ClientApiKeyResponseDto> => {
        try {
            const client = await this._clientRepository.findOne({
                where : {
                    id : id
                }
            });
            client.ApiKey = apiKey;
            client.ValidFrom = validFrom;
            client.ValidTill = validTill;
            var record = await this._clientRepository.save(client);
            return ClientMapper.toClientSecretsResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public isApiKeyValid = async (apiKey: string): Promise<CurrentClient> => {
        try {
            const client = await this._clientRepository.findOne({
                where : {
                    ApiKey    : apiKey,
                    ValidFrom : LessThanOrEqual(new Date()),
                    ValidTill : MoreThanOrEqual(new Date())
                }
            });
            if (client == null){
                return null;
            }
            const currentClient: CurrentClient = {
                Name         : client.Name,
                Code         : client.Code,
                IsPrivileged : client.IsPrivileged
            };
            return currentClient;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public update = async (id: uuid, updateModel: ClientUpdateModel): Promise<ClientResponseDto> => {
        try {
            const client = await this._clientRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!client) {
                ErrorHandler.throwNotFoundError('client not found!');
            }
            //Client code is not modifiable
            //Use renew key to update ApiKey, ValidFrom and ValidTill

            if (updateModel.Name != null) {
                client.Name = updateModel.Name;
            }
            if (updateModel.Password != null) {
                client.Password = StringUtils.hash(updateModel.Password);
            }
            if (updateModel.CountryCode != null) {
                client.CountryCode = updateModel.CountryCode;
            }
            if (updateModel.Phone != null) {
                client.Phone = updateModel.Phone;
            }
            if (updateModel.IsPrivileged != null) {
                client.IsPrivileged = updateModel.IsPrivileged;
            }
            if (updateModel.Email != null) {
                client.Email = updateModel.Email;
            }
            if (updateModel.ValidFrom != null) {
                client.ValidFrom = updateModel.ValidFrom;
            }
            if (updateModel.ValidTill != null) {
                client.ValidTill = updateModel.ValidTill;
            }
            var record = await this._clientRepository.save(client);
            return ClientMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._clientRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._clientRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: ClientSearchFilters) => {

        var search : FindManyOptions<Client> = {
            relations : {
            },
            where : {
            },
            select : {
                id           : true,
                Name         : true,
                Code         : true,
                Phone        : true,
                Email        : true,
                CountryCode  : true,
                IsPrivileged : true,
            }
        };

        if (filters.Name) {
            search.where['Name'] = Like(`%${filters.Name}%`);
        }
        if (filters.Code) {
            search.where['Code'] = Like(`%${filters.Code}%`);
        }
        if (filters.IsPrivileged) {
            search.where['IsPrivileged'] = filters.IsPrivileged;
        }
        if (filters.CountryCode) {
            search.where['CountryCode'] = filters.CountryCode;
        }
        if (filters.Phone) {
            search.where['Phone'] = filters.Phone;
        }
        if (filters.Email) {
            search.where['Email'] = filters.Email;
        }

        return search;
    };

    private addSortingAndPagination = (
        search: FindManyOptions<Client>, filters: ClientSearchFilters) => {

        //Sorting
        let orderByColumn = 'CreatedAt';
        if (filters.OrderBy) {
            orderByColumn = filters.OrderBy;
        }
        let order = 'ASC';
        if (filters.Order === 'descending') {
            order = 'DESC';
        }
        search['order'] = {};
        search['order'][orderByColumn] = order;

        //Pagination
        let limit = 25;
        if (filters.ItemsPerPage) {
            limit = filters.ItemsPerPage;
        }
        let offset = 0;
        let pageIndex = 0;
        if (filters.PageIndex) {
            pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
            offset = pageIndex * limit;
        }
        search['take'] = limit;
        search['skip'] = offset;

        return { search, pageIndex, limit, order, orderByColumn };
    };

    //#endregion

}
