import { Context } from '../../models/engine/context.model';
import { Participant } from '../../models/awards/participant.model';
import { ParticipantGroup } from '../../models/awards/participant.group.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, Repository } from 'typeorm';
import { ContextMapper } from '../../mappers/engine/context.mapper';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import {
    ContextCreateModel,
    ContextResponseDto,
    ContextSearchFilters,
    ContextSearchResults
} from '../../../domain.types/engine/context.types';
import { ContextType } from '../../../domain.types/engine/engine.types';

///////////////////////////////////////////////////////////////////////

export class ContextService extends BaseService {

    //#region Repositories

    _eventRepository: Repository<Context> = Source.getRepository(Context);

    _participantRepository: Repository<Participant> = Source.getRepository(Participant);

    _participantGroupRepository: Repository<ParticipantGroup> = Source.getRepository(ParticipantGroup);

    //#endregion

    public create = async (createModel: ContextCreateModel)
        : Promise<ContextResponseDto> => {

        var obj: any = {
            ReferenceId : createModel.ReferenceId,
        };
        if (!createModel.Type) {
            obj.Type = ContextType.Person;
        }
        if (obj.Type === ContextType.Person) {
            var participant = await this._participantRepository.findOne({
                where : {
                    ReferenceId : createModel.ReferenceId
                }
            });
            if (participant) {
                obj.Participant = participant;
            }
        }
        const event = this._eventRepository.create();
        var record = await this._eventRepository.save(event);
        return ContextMapper.toResponseDto(record);
    };

    public getById = async (id: uuid): Promise<ContextResponseDto> => {
        try {
            var event = await this._eventRepository.findOne({
                where : {
                    id : id
                }
            });
            return ContextMapper.toResponseDto(event);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getByReferenceId = async (referenceId: uuid): Promise<ContextResponseDto> => {
        try {
            var event = await this._eventRepository.findOne({
                where : {
                    ReferenceId : referenceId
                }
            });
            return ContextMapper.toResponseDto(event);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: ContextSearchFilters)
        : Promise<ContextSearchResults> => {
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
                Items          : list.map(x => ContextMapper.toResponseDto(x)),
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

    private getSearchModel = (filters: ContextSearchFilters) => {

        var search : FindManyOptions<Context> = {
            relations : {
            },
            where : {
            },
            select : {
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
                CreatedAt : true,
                UpdatedAt : true,
            }
        };

        if (filters.ReferenceId) {
            search.where['ReferenceId'] = filters.ReferenceId;
        }

        return search;
    };

    //#endregion

}
