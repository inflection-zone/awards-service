import { IncomingEvent } from '../../models/engine/incoming.event.model';
import { Context } from '../../models/engine/context.model';
import { IncomingEventType } from '../../models/engine/incoming.event.type.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, Repository } from 'typeorm';
import { IncomingEventMapper } from '../../mappers/engine/incoming.event.mapper';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import {
    IncomingEventCreateModel,
    IncomingEventResponseDto,
    IncomingEventSearchFilters,
    IncomingEventSearchResults
} from '../../../domain.types/engine/incoming.event.types';

///////////////////////////////////////////////////////////////////////

export class IncomingEventService extends BaseService {

    //#region Repositories

    _eventRepository: Repository<IncomingEvent> = Source.getRepository(IncomingEvent);

    _contextRepository: Repository<Context> = Source.getRepository(Context);

    _eventTypeRepository: Repository<IncomingEventType> = Source.getRepository(IncomingEventType);

    //#endregion

    public create = async (createModel: IncomingEventCreateModel)
        : Promise<IncomingEventResponseDto> => {

        const context = await this.getOrCreateContextByReferenceId(createModel.ReferenceId);
        const eventType = await this.getIncomingEventType(createModel.TypeId);

        const event = this._eventRepository.create({
            Context   : context,
            EventType : eventType,
            Payload   : createModel.Payload,
            ReferenceId : createModel.ReferenceId,
        });
        var record = await this._eventRepository.save(event);
        return IncomingEventMapper.toResponseDto(record);
    };

    public getById = async (id: uuid): Promise<IncomingEventResponseDto> => {
        try {
            var event = await this._eventRepository.findOne({
                where : {
                    id : id
                }
            });
            return IncomingEventMapper.toResponseDto(event);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: IncomingEventSearchFilters)
        : Promise<IncomingEventSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._eventRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => IncomingEventMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._eventRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._eventRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: IncomingEventSearchFilters) => {

        var search : FindManyOptions<IncomingEvent> = {
            relations : {
            },
            where : {
            },
            select : {
                id        : true,
                Payload   : true,
                EventType : {
                    id          : true,
                    Name        : true,
                    Description : true,
                },
                Context : {
                    id          : true,
                    ReferenceId : true,
                    Type        : true,
                    Participant : {
                        id          : true,
                        ReferenceId : true,
                        Prefix      : true,
                        FirstName   : true,
                        LastName    : true,
                    },
                    Group : {
                        id          : true,
                        Name        : true,
                        Description : true,
                    },
                },
                CreatedAt : true,
                UpdatedAt : true,
            }
        };

        if (filters.ReferenceId) {
            search.where['ReferenceId'] = filters.ReferenceId;
        }
        if (filters.TypeId) {
            search.where['EventType'].id = filters.TypeId;
        }

        return search;
    };

    //#endregion

    private async getOrCreateContextByReferenceId(referenceId: uuid) {
        if (!referenceId) {
            return null;
        }
        var context = await this._contextRepository.findOne({
            where : {
                ReferenceId : referenceId
            }
        });
        if (!context) {
            var record = await this._contextRepository.create({
                ReferenceId : referenceId,
            });
            context = await this._contextRepository.save(record);
        }
        return context;
    }

    private async getIncomingEventType(typeId: uuid) {
        if (!typeId) {
            return null;
        }
        const type = await this._eventTypeRepository.findOne({
            where : {
                id : typeId
            }
        });
        if (!type) {
            ErrorHandler.throwNotFoundError('Incoming event type cannot be found');
        }
        return type;
    }

}
