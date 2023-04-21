import { Client } from '../../models/client/client.model';
import { BadgeCategory } from '../../models/awards/badge.category.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { BadgeCategoryMapper } from '../../mappers/awards/badge.category.mapper';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { 
    BadgeCategoryCreateModel, 
    BadgeCategoryResponseDto, 
    BadgeCategorySearchFilters, 
    BadgeCategorySearchResults, 
    BadgeCategoryUpdateModel } from '../../../domain.types/awards/badge.category.domain.types';

///////////////////////////////////////////////////////////////////////

export class BadgeCategoryService extends BaseService {

    //#region Repositories

    _clientRepository: Repository<Client> = Source.getRepository(Client);

    _categoryRepository: Repository<BadgeCategory> = Source.getRepository(BadgeCategory);

    //#endregion

    public create = async (createModel: BadgeCategoryCreateModel)
        : Promise<BadgeCategoryResponseDto> => {

        const client = await this.getClient(createModel.ClientId);
        const badge = this._categoryRepository.create({
            Client     : client,
            Name       : createModel.Name,
            Description: createModel.Description,
            ImageUrl   : createModel.ImageUrl,
        });
        var record = await this._categoryRepository.save(badge);
        return BadgeCategoryMapper.toResponseDto(record);
    };

    public getById = async (id: uuid): Promise<BadgeCategoryResponseDto> => {
        try {
            var badge = await this._categoryRepository.findOne({
                where : {
                    id : id
                },
                relations: {
                    Client: true
                }
            });
            return BadgeCategoryMapper.toResponseDto(badge);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: BadgeCategorySearchFilters)
        : Promise<BadgeCategorySearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._categoryRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => BadgeCategoryMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public update = async (id: uuid, model: BadgeCategoryUpdateModel)
        : Promise<BadgeCategoryResponseDto> => {
        try {
            const badge = await this._categoryRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!badge) {
                ErrorHandler.throwNotFoundError('Badge category not found!');
            }
            //Badge code is not modifiable
            //Use renew key to update ApiKey, ValidFrom and ValidTill

            if (model.ClientId != null) {
                const client = await this.getClient(model.ClientId);
                badge.Client = client;
            }
            if (model.Name != null) {
                badge.Name = model.Name;
            }
            if (model.Description != null) {
                badge.Description = model.Description;
            }
            if (model.ImageUrl != null) {
                badge.ImageUrl = model.ImageUrl;
            }
            var record = await this._categoryRepository.save(badge);
            return BadgeCategoryMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._categoryRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._categoryRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: BadgeCategorySearchFilters) => {

        var search : FindManyOptions<BadgeCategory> = {
            relations : {
            },
            where : {
            },
            select : {
                id      : true,
                Client       : {
                    id  : true,
                    Name: true,
                    Code: true,
                },
                Name       : true,
                Description: true,
                ImageUrl   : true,
                CreatedAt  : true,
                UpdatedAt  : true,
            }
        };
        if (filters.ClientId) {
            search.where['Client'].id = filters.ClientId;
        }
        if (filters.Name) {
            search.where['Name'] = Like(`%${filters.Name}%`);
        }

        return search;
    };

    //#endregion

    private async getClient(clientId: uuid) {
        const client = await this._clientRepository.findOne({
            where: {
                id: clientId
            }
        });
        if (!client) {
            ErrorHandler.throwNotFoundError('Client cannot be found');
        }
        return client;
    }

}
