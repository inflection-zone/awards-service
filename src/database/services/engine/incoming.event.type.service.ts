import { IncomingEventType } from '../../models/engine/incoming.event.type.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { IncomingEventTypeMapper } from '../../mappers/engine/incoming.event.type.mapper';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import {
    IncomingEventTypeCreateModel,
    IncomingEventTypeResponseDto,
    IncomingEventTypeSearchFilters,
    IncomingEventTypeSearchResults,
    IncomingEventTypeUpdateModel
} from '../../../domain.types/engine/incoming.event.type.types';

///////////////////////////////////////////////////////////////////////

export class IncomingEventTypeService extends BaseService {

    //#region Repositories

    _typeRepository: Repository<IncomingEventType> = Source.getRepository(IncomingEventType);

    //#endregion

    public create = async (createModel: IncomingEventTypeCreateModel)
        : Promise<IncomingEventTypeResponseDto> => {

        const type = this._typeRepository.create({
            Name        : createModel.Name,
            Description : createModel.Description,
        });
        var record = await this._typeRepository.save(type);
        return IncomingEventTypeMapper.toResponseDto(record);
    };

    public getById = async (id: uuid): Promise<IncomingEventTypeResponseDto> => {
        try {
            var type = await this._typeRepository.findOne({
                where : {
                    id : id
                }
            });
            return IncomingEventTypeMapper.toResponseDto(type);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getAll = async ()
        : Promise<IncomingEventTypeResponseDto[]> => {
        try {
            const list = await this._typeRepository.find();
            const events = list.map(x => IncomingEventTypeMapper.toResponseDto(x));
            return events;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to get records!', error);
        }
    };

    public search = async (filters: IncomingEventTypeSearchFilters)
        : Promise<IncomingEventTypeSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._typeRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => IncomingEventTypeMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public update = async (id: uuid, model: IncomingEventTypeUpdateModel)
        : Promise<IncomingEventTypeResponseDto> => {
        try {
            const type = await this._typeRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!type) {
                ErrorHandler.throwNotFoundError('IncomingEventType not found!');
            }
            if (model.Name != null) {
                type.Name = model.Name;
            }
            if (model.Description != null) {
                type.Description = model.Description;
            }
            var record = await this._typeRepository.save(type);
            return IncomingEventTypeMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._typeRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._typeRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: IncomingEventTypeSearchFilters) => {

        var search : FindManyOptions<IncomingEventType> = {
            relations : {
            },
            where : {
            },
            select : {
                id          : true,
                Name        : true,
                Description : true,
                CreatedAt   : true,
                UpdatedAt   : true,
            }
        };

        if (filters.Name) {
            search.where['Name'] = Like(`%${filters.Name}%`);
        }

        return search;
    };

    //#endregion

}
