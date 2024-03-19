import { ParticipantGroup } from '../../models/awards/participant.group.model';
import { Client } from '../../models/client/client.model';
import { Participant } from '../../models/awards/participant.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { ParticipantGroupMapper } from '../../mappers/awards/participant.group.mapper';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import {
    ParticipantGroupCreateModel,
    ParticipantGroupResponseDto,
    ParticipantGroupSearchFilters,
    ParticipantGroupSearchResults,
    ParticipantGroupUpdateModel } from '../../../domain.types/awards/participant.group.domain.types';
import { Context } from '../../models/engine/context.model';
import { ContextType } from '../../../domain.types/engine/engine.types';

///////////////////////////////////////////////////////////////////////

export class ParticipantGroupService extends BaseService {

    //#region Repositories

    _groupRepository: Repository<ParticipantGroup> = Source.getRepository(ParticipantGroup);

    _clientRepository: Repository<Client> = Source.getRepository(Client);

    _participantRepository: Repository<Participant> = Source.getRepository(Participant);

    _contextRepository: Repository<Context> = Source.getRepository(Context);

    //#endregion

    public create = async (createModel: ParticipantGroupCreateModel)
        : Promise<ParticipantGroupResponseDto> => {

        const client = await this.getClient(createModel.ClientId);
        const badge = this._groupRepository.create({
            Client      : client,
            ReferenceId : createModel.ReferenceId,
            Name        : createModel.Name,
            Description : createModel.Description,
            ImageUrl    : createModel.ImageUrl,
        });
        var record = await this._groupRepository.save(badge);

        //Keep group context for this participant group
        const context = this._contextRepository.create({
            Type        : ContextType.Group,
            ReferenceId : record.ReferenceId,
            Group       : record,
        });
        const contextRecord = await this._contextRepository.save(context);
        logger.info(JSON.stringify(contextRecord, null, 2));

        return ParticipantGroupMapper.toResponseDto(record);
    };

    public getById = async (id: uuid): Promise<ParticipantGroupResponseDto> => {
        try {
            var badge = await this._groupRepository.findOne({
                where : {
                    id : id
                }
            });
            return ParticipantGroupMapper.toResponseDto(badge);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: ParticipantGroupSearchFilters)
        : Promise<ParticipantGroupSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._groupRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => ParticipantGroupMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public update = async (id: uuid, model: ParticipantGroupUpdateModel)
        : Promise<ParticipantGroupResponseDto> => {
        try {
            const badge = await this._groupRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!badge) {
                ErrorHandler.throwNotFoundError('ParticipantGroup not found!');
            }
            //ParticipantGroup code is not modifiable
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
            var record = await this._groupRepository.save(badge);
            return ParticipantGroupMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._groupRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._groupRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public addParticipant = async (groupId: uuid, participantId: uuid): Promise<boolean> => {
        try {
            var group = await this._groupRepository.findOne({
                where : {
                    id : groupId
                }
            });
            if (!group) {
                ErrorHandler.throwNotFoundError('ParticipantGroup not found!');
            }
            var participant = await this._participantRepository.findOne({
                where : {
                    id : participantId
                }
            });
            if (!participant) {
                ErrorHandler.throwNotFoundError('Participant not found!');
            }
            group.Participants.push(participant);
            var result = await this._groupRepository.save(group);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public removeParticipant = async (groupId: uuid, participantId: uuid): Promise<boolean> => {
        try {
            var group = await this._groupRepository.findOne({
                where : {
                    id : groupId
                }
            });
            if (!group) {
                ErrorHandler.throwNotFoundError('ParticipantGroup not found!');
            }
            var participant = await this._participantRepository.findOne({
                where : {
                    id : participantId
                }
            });
            if (!participant) {
                ErrorHandler.throwNotFoundError('Participant not found!');
            }
            group.Participants = group.Participants.filter(x => x.id !== participant.id);
            var result = await this._groupRepository.save(group);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getParticipants = async (groupId: uuid): Promise<Participant[]> => {
        try {
            var group = await this._groupRepository.findOne({
                where : {
                    id : groupId
                }
            });
            if (!group) {
                ErrorHandler.throwNotFoundError('ParticipantGroup not found!');
            }
            return group.Participants;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: ParticipantGroupSearchFilters) => {

        var search : FindManyOptions<ParticipantGroup> = {
            relations : {
            },
            where : {
                // Participants: {
                //     id : filters.ParticipantId
                // }
            },
            select : {
                id     : true,
                ReferenceId : true,
                Client : {
                    id   : true,
                    Name : true,
                    Code : true,
                },
                Participants : {
                    id : true,
                },
                Name        : true,
                Description : true,
                ImageUrl    : true,
                CreatedAt   : true,
                UpdatedAt   : true,
            }
        };

        if (filters.ParticipantId) {
            search.where['Participants'].id = filters.ParticipantId;
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

    private async getClient(clientId: uuid) {
        const client = await this._clientRepository.findOne({
            where : {
                id : clientId
            }
        });
        if (!client) {
            ErrorHandler.throwNotFoundError('Client cannot be found');
        }
        return client;
    }

}
