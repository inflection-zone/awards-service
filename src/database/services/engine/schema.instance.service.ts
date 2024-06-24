import { SchemaInstance } from '../../models/engine/schema.instance.model';
import { Schema } from '../../models/engine/schema.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, Repository } from 'typeorm';
import { SchemaInstanceMapper } from '../../mappers/engine/schema.instance.mapper';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import {
    SchemaInstanceCreateModel,
    SchemaInstanceResponseDto,
    SchemaInstanceSearchFilters,
    SchemaInstanceSearchResults,
    SchemaInstanceUpdateModel } from '../../../domain.types/engine/schema.instance.types';
import { Context } from '../../models/engine/context.model';
import { NodeInstance } from '../../models/engine/node.instance.model';
import { Node } from '../../models/engine/node.model';
import { IncomingEventType } from '../../models/engine/incoming.event.type.model';
import { CommonUtilsService } from './common.utils.service';

///////////////////////////////////////////////////////////////////////

export class SchemaInstanceService extends BaseService {

    //#region Repositories

    _schemaInstanceRepository: Repository<SchemaInstance> = Source.getRepository(SchemaInstance);

    _schemaRepository: Repository<Schema> = Source.getRepository(Schema);

    _contextRepository: Repository<Context> = Source.getRepository(Context);

    _nodeRepository: Repository<Node> = Source.getRepository(Node);

    _nodeInstanceRepository: Repository<NodeInstance> = Source.getRepository(NodeInstance);

    _commonUtils: CommonUtilsService = new CommonUtilsService();

    //#endregion

    public create = async (createModel: SchemaInstanceCreateModel)
        : Promise<SchemaInstanceResponseDto> => {

        const schema = await this._commonUtils.getSchema(createModel.SchemaId);
        const rootNode = await this._commonUtils.getNode(schema.RootNodeId);
        const context = await this._commonUtils.getContext(createModel.ContextId);

        const schemaInstance = this._schemaInstanceRepository.create({
            Schema  : schema,
            Context : context,
        });
        var record = await this._schemaInstanceRepository.save(schemaInstance);
        const rootNodeInstance = await this._nodeInstanceRepository.create({
                Node: rootNode,
                SchemaInstance: schemaInstance
            }
        );
        const rootNodeInstanceRecord = await this._nodeInstanceRepository.save(rootNodeInstance);

        record.RootNodeInstance = rootNodeInstanceRecord;
        record.CurrentNodeInstance = rootNodeInstanceRecord;
        record = await this._schemaInstanceRepository.save(record);

        const rootNodeId = schema.RootNodeId;

        if (schema.Nodes && schema.Nodes.length > 0) {
            for await (var node of schema.Nodes) {
                if (node.id !== rootNodeId) {
                    var nodeInstance = await this._nodeInstanceRepository.create({
                        Node: node,
                        SchemaInstance: schemaInstance
                    });
                    const nodeInstanceRecord = await this._nodeInstanceRepository.save(nodeInstance);
                }
            }
        }

        return await this.getById(record.id);
    };

    public getById = async (id: uuid): Promise<SchemaInstanceResponseDto> => {
        try {
            var schemaInstance = await this._schemaInstanceRepository.findOne({
                where : {
                    id : id
                },
                relations: {
                    Schema             : {
                        Client: true,
                        Nodes: true,
                    },
                    Context            : {
                        Participant: true,
                    },
                    CurrentNodeInstance: {
                        Node: true,
                    },
                    RootNodeInstance   : {
                        Node: true,
                    },
                    NodeInstances      : {
                        Node: true,
                    },
                }
            });
            return SchemaInstanceMapper.toResponseDto(schemaInstance);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public getByContextId = async (contextId: uuid): Promise<SchemaInstanceResponseDto[]> => {
        try {
            var instances = await this._schemaInstanceRepository.find({
                where : {
                    Context : {
                        id : contextId
                    }
                },
                relations: {
                    Schema             : {
                        Client: true,
                        Nodes: true,
                    },
                    Context            : {
                        Participant: true,
                    },
                    CurrentNodeInstance: {
                        Node: true,
                    },
                    RootNodeInstance   : {
                        Node: true,
                    },
                    NodeInstances      : {
                        Node: true,
                    },
                }
            });
            return instances.map(x => SchemaInstanceMapper.toResponseDto(x));
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: SchemaInstanceSearchFilters)
        : Promise<SchemaInstanceSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._schemaInstanceRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => SchemaInstanceMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            logger.error(error.stack);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public update = async (id: uuid, model: SchemaInstanceUpdateModel)
        : Promise<SchemaInstanceResponseDto> => {
        try {
            const schemaInstance = await this._schemaInstanceRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!schemaInstance) {
                ErrorHandler.throwNotFoundError('SchemaInstance not found!');
            }
            if (model.SchemaId != null) {
                const schema = await this._commonUtils.getSchema(model.SchemaId);
                schemaInstance.Schema = schema;
            }
            if (model.ContextId != null) {
                const context = await this._commonUtils.getContext(model.ContextId);
                schemaInstance.Context = context;
            }
            var record = await this._schemaInstanceRepository.save(schemaInstance);
            return SchemaInstanceMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._schemaInstanceRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._schemaInstanceRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: SchemaInstanceSearchFilters) => {

        var search : FindManyOptions<SchemaInstance> = {
            relations: {
                Schema             : {
                    Client: true,
                    Nodes: true,
                },
                Context            : {
                    Participant: true,
                },
                CurrentNodeInstance: {
                    Node: true,
                },
                RootNodeInstance   : {
                    Node: true,
                },
                NodeInstances      : {
                    Node: true,
                },
            },
            where : {
            },
            select : {
                id     : true,
                Schema : {
                    id          : true,
                    Name        : true,
                    Description : true,
                    Client      : {
                        id   : true,
                        Name : true,
                    }
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
                RootNodeInstance : {
                    id   : true,
                    Node : {
                        id   : true,
                        Name : true,
                    },
                },
                CurrentNodeInstance : {
                    id   : true,
                    Node : {
                        id   : true,
                        Name : true,
                    },
                },
                NodeInstances : {
                    id   : true,
                    Node : {
                        id   : true,
                        Name : true,
                    },
                },
                CreatedAt : true,
                UpdatedAt : true,
            },
        };

        if (filters.SchemaId) {
            search.where['Schema'] = {
                id: ''
            };
            search.where['Schema'].id = filters.SchemaId;
        }
        if (filters.ContextId) {
            search.where['Context'] = {
                id: ''
            };
            search.where['Context'].id = filters.ContextId;
        }

        return search;
    };

    //#endregion

}
