import { Badge } from '../../models/awards/badge.model';
import { Client } from '../../models/client/client.model';
import { BadgeCategory } from '../../models/awards/badge.category.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { BadgeMapper } from '../../mappers/awards/badge.mapper';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { 
    BadgeCreateModel, 
    BadgeResponseDto, 
    BadgeSearchFilters, 
    BadgeSearchResults, 
    BadgeUpdateModel } from '../../../domain.types/awards/badge.domain.types';

///////////////////////////////////////////////////////////////////////

export class BadgeService extends BaseService {

    //#region Repositories

    _badgeRepository: Repository<Badge> = Source.getRepository(Badge);

    _clientRepository: Repository<Client> = Source.getRepository(Client);

    _categoryRepository: Repository<BadgeCategory> = Source.getRepository(BadgeCategory);

    //#endregion

    public create = async (createModel: BadgeCreateModel)
        : Promise<BadgeResponseDto> => {

        const client = await this.getClient(createModel.ClientId);
        const category = await this.getBadgeCategory(createModel.CategoryId);
        const badge = this._badgeRepository.create({
            Client     : client,
            Category   : category,
            Name       : createModel.Name,
            Description: createModel.Description,
            ImageUrl   : createModel.ImageUrl,
        });
        var record = await this._badgeRepository.save(badge);
        return BadgeMapper.toResponseDto(record);
    };

    public getById = async (id: uuid): Promise<BadgeResponseDto> => {
        try {
            var badge = await this._badgeRepository.findOne({
                where : {
                    id : id
                },
                relations: {
                    Category: true,
                    Client  : true
                }
            });
            return BadgeMapper.toResponseDto(badge);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getByClientId = async (clientId: uuid): Promise<BadgeResponseDto[]> => {
        try {
            var badges = await this._badgeRepository.find({
                where : {
                    Client : {
                        id : clientId
                    }
                },
                relations: {
                    Category: true,
                    Client  : true
                }
            });
            return badges.map(x => BadgeMapper.toResponseDto(x));
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: BadgeSearchFilters)
        : Promise<BadgeSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._badgeRepository.findAndCount(search);

            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => BadgeMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public update = async (id: uuid, model: BadgeUpdateModel)
        : Promise<BadgeResponseDto> => {
        try {
            const badge = await this._badgeRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!badge) {
                ErrorHandler.throwNotFoundError('Badge not found!');
            }
            //Badge code is not modifiable
            //Use renew key to update ApiKey, ValidFrom and ValidTill

            if (model.ClientId != null) {
                const client = await this.getClient(model.ClientId);
                badge.Client = client;
            }
            if (model.CategoryId != null) {
                const category = await this.getBadgeCategory(model.CategoryId);
                badge.Category = category;
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
            if (model.HowToEarn != null) {
                badge.HowToEarn = model.HowToEarn;
            }
            var record = await this._badgeRepository.save(badge);
            return BadgeMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._badgeRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._badgeRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: BadgeSearchFilters) => {

        var search : FindManyOptions<Badge> = {
            relations: {
                Category: true,
                Client  : true
            },
            where : {
            },
            select : {
                id      : true,
                Category: {
                    id         : true,
                    Name       : true,
                    Description: true,
                },
                Client       : {
                    id  : true,
                    Name: true,
                    Code: true,
                },
                Name       : true,
                Description: true,
                ImageUrl   : true,
                HowToEarn  : true,
                CreatedAt  : true,
                UpdatedAt  : true,
            }
        };

        if (filters.CategoryId) {
            search.where['Category'].id = filters.CategoryId;
        }
        if (filters.ClientId) {
            search.where['Client'].id = filters.ClientId;
        }
        if (filters.Name) {
            search.where['Name'] = Like(`%${filters.Name}%`);
        }

        return search;
    };

    //#endregion

    private async getBadgeCategory(categoryId: uuid) {
        const category = await this._categoryRepository.findOne({
            where: {
                id: categoryId
            }
        });
        if (!category) {
            ErrorHandler.throwNotFoundError('Badge category cannot be found');
        }
        return category;
    }

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
