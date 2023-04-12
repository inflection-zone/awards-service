import { Schema } from '../../models/engine/schema.model';
import { Client } from '../../models/client/client.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, In, Like, Repository } from 'typeorm';
import { SchemaMapper } from '../../mappers/engine/schema.mapper';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import {
    SchemaCreateModel,
    SchemaResponseDto,
    SchemaSearchFilters,
    SchemaSearchResults,
    SchemaUpdateModel } from '../../../domain.types/engine/schema.domain.types';
import { IncomingEventType } from '../../models/engine/incoming.event.type.model';
import { Rule } from '../../models/engine/rule.model';
import { Node } from '../../models/engine/node.model';
import { Condition } from '../../models/engine/condition.model';
import { SchemaEventType } from '../../models/engine/schema.event.type.model';
import { CommonUtilsService } from './common.utils.service';
import { NodeDefaultAction } from '../../../database/models/engine/node.default.action.model';

///////////////////////////////////////////////////////////////////////

export class SchemaService extends BaseService {

    //#region Repositories

    _schemaRepository: Repository<Schema> = Source.getRepository(Schema);

    _actionRepository: Repository<NodeDefaultAction> = Source.getRepository(NodeDefaultAction);

    _clientRepository: Repository<Client> = Source.getRepository(Client);

    _eventTypeRepository: Repository<IncomingEventType> = Source.getRepository(IncomingEventType);

    _nodeRepository: Repository<Node> = Source.getRepository(Node);

    _ruleRepository: Repository<Rule> = Source.getRepository(Rule);

    _conditionRepository: Repository<Condition> = Source.getRepository(Condition);

    _schemaEventTypeRepository: Repository<SchemaEventType> = Source.getRepository(SchemaEventType);

    _commonUtils: CommonUtilsService = new CommonUtilsService();

    //#endregion

    public create = async (createModel: SchemaCreateModel)
        : Promise<SchemaResponseDto> => {

        const client = await this._commonUtils.getClient(createModel.ClientId);

        const rootNodeName = 'Root Node' + createModel.Name.substring(0, 25);
        let rootNode;
        if (createModel.RootNode) {
            const action = await this._commonUtils.createAction(createModel.RootNode.Action);  
            const actionRecord = await this. _actionRepository.save(action);
            rootNode = this._nodeRepository.create({
                ParentNode : null,
                Name       : createModel.RootNode.Name,
                Type       : createModel.RootNode.Type,
                Description: createModel.RootNode.Description,
                Action     : actionRecord,
            });
        }
        else {
            rootNode = await this._nodeRepository.create({
                Name: rootNodeName,
                ParentNode: null,
                Description: `Root node for ${createModel.Name}`,
            });
        }
        var rootNodeRecord = await this._nodeRepository.save(rootNode);

        const schema = this._schemaRepository.create({
            Client     : client,
            Name       : createModel.Name,
            Description: createModel.Description,
            Type       : createModel.Type,
            ValidFrom  : createModel.ValidFrom,
            ValidTill  : createModel.ValidTill,
            IsValid    : createModel.IsValid ?? true,
            RootNodeId : rootNodeRecord.id,
        });
        var schemaRecord = await this._schemaRepository.save(schema);

        rootNode.Schema = schemaRecord;
        rootNodeRecord = await this._nodeRepository.save(rootNode);

        await this.addEventTypesToSchema(createModel, schema);
        const eventTypeRecords = await this.getEventTypesForSchema(schemaRecord.id);

        return SchemaMapper.toResponseDto(schemaRecord, rootNodeRecord, eventTypeRecords);
    };

    public getById = async (id: uuid): Promise<SchemaResponseDto> => {
        try {
            var schema = await this._schemaRepository.findOne({
                where : {
                    id : id
                },
                relations: {
                    Client    : true,
                    Nodes     : true,
                }
            });
            const rootNode = await this._commonUtils.getNode(schema.RootNodeId);
            const eventTypes = await this.getEventTypesForSchema(id);
            return SchemaMapper.toResponseDto(schema, rootNode, eventTypes);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getByEventType = async (eventTypeId: uuid): Promise<SchemaResponseDto[]> => {
        try {
            var records = await this._schemaEventTypeRepository.find({
                where : {
                    EventType: {
                        id: eventTypeId
                    }
                },
                relations: {
                    Schema : true,
                }
            });
            return records.map(x => SchemaMapper.toResponseDto(x.Schema, null));
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: SchemaSearchFilters)
        : Promise<SchemaSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._schemaRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => SchemaMapper.toResponseDto(x, null)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public update = async (id: uuid, model: SchemaUpdateModel)
        : Promise<SchemaResponseDto> => {
        try {
            const schema = await this._schemaRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!schema) {
                ErrorHandler.throwNotFoundError('Schema not found!');
            }
            //Schema code is not modifiable
            //Use renew key to update ApiKey, ValidFrom and ValidTill

            if (model.ClientId != null) {
                const client = await this._commonUtils.getClient(model.ClientId);
                schema.Client = client;
            }
            if (model.Name != null) {
                schema.Name = model.Name;
            }
            if (model.Description != null) {
                schema.Description = model.Description;
            }
            if (model.Type != null) {
                schema.Type = model.Type;
            }
            if (model.ValidFrom != null) {
                schema.ValidFrom = model.ValidFrom;
            }
            if (model.ValidTill != null) {
                schema.ValidTill = model.ValidTill;
            }
            if (model.IsValid != null) {
                schema.IsValid = model.IsValid;
            }
            const rootNode = await this._commonUtils.getNode(schema.RootNodeId);
            var record = await this._schemaRepository.save(schema);
            return SchemaMapper.toResponseDto(record, rootNode);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._schemaRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._schemaRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: SchemaSearchFilters) => {

        var search : FindManyOptions<Schema> = {
            relations : {
            },
            where : {
            },
            select : {
                id     : true,
                Client : {
                    id   : true,
                    Name : true,
                    Code : true,
                },
                Name        : true,
                Description : true,
                ValidFrom   : true,
                ValidTill   : true,
                IsValid     : true,
                CreatedAt   : true,
                UpdatedAt   : true,
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

    private async addEventTypesToSchema(createModel: SchemaCreateModel, schema: Schema) {
        var eventTypes = [];
        if (createModel.EventTypeIds) {
            eventTypes = await this._eventTypeRepository.find({
                where: {
                    id: In(createModel.EventTypeIds)
                }
            });
        }
        for await (var eventType of eventTypes) {
            const se = await this._schemaEventTypeRepository.create({
                EventType: eventType,
                Schema: schema
            });
            const seRecord = await this._schemaEventTypeRepository.save(se);
        }
    }

    private async getEventTypesForSchema(id: string) {
        const schemaEventTypes = await this._schemaEventTypeRepository.find({
            where: {
                Schema: {
                    id: id
                }
            },
            relations: {
                Schema   : true,
                EventType: true,
            }
        });
        const eventTypes = await schemaEventTypes.map(x => x.EventType);
        return eventTypes;
    }

    //#endregion

}
