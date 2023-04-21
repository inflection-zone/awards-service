import { Node } from '../../models/engine/node.model';
import { Schema } from '../../models/engine/schema.model';
import { Rule } from '../../models/engine/rule.model';
import { NodeDefaultAction } from '../../models/engine/node.default.action.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { NodeMapper } from '../../mappers/engine/node.mapper';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { 
    NodeCreateModel, 
    NodeResponseDto, 
    NodeSearchFilters, 
    NodeSearchResults, 
    NodeUpdateModel } from '../../../domain.types/engine/node.domain.types';
import { CommonUtilsService } from './common.utils.service';

///////////////////////////////////////////////////////////////////////

export class NodeService extends BaseService {

    //#region Repositories

    _nodeRepository: Repository<Node> = Source.getRepository(Node);

    _schemaRepository: Repository<Schema> = Source.getRepository(Schema);

    _ruleRepository: Repository<Rule> = Source.getRepository(Rule);

    _actionRepository: Repository<NodeDefaultAction> = Source.getRepository(NodeDefaultAction);

    _commonUtils: CommonUtilsService = new CommonUtilsService();

    //#endregion

    public create = async (createModel: NodeCreateModel)
        : Promise<NodeResponseDto> => {

        const schema = await this._commonUtils.getSchema(createModel.SchemaId);
        const action = await this._commonUtils.createAction(createModel.Action);
        const actionRecord = await this._actionRepository.save(action);
        const parentNode = await this.getNode(createModel.ParentNodeId);

        const node = this._nodeRepository.create({
            Schema     : schema,
            ParentNode : parentNode,
            Name       : createModel.Name,
            Description: createModel.Description,
            Action     : actionRecord,
        });
        var record = await this._nodeRepository.save(node);
        return NodeMapper.toResponseDto(record);
    };

    public getById = async (id: uuid): Promise<NodeResponseDto> => {
        try {
            var node = await this._nodeRepository.findOne({
                where : {
                    id : id
                },
                relations: {
                    Action    : true,
                    ParentNode: true,
                    Schema    : true,
                    Rules     : true,
                    Children  : true,
                }
            });
            return NodeMapper.toResponseDto(node);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: NodeSearchFilters)
        : Promise<NodeSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._nodeRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => NodeMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public update = async (id: uuid, model: NodeUpdateModel)
        : Promise<NodeResponseDto> => {
        try {
            const node = await this._nodeRepository.findOne({
                where : {
                    id : id
                },
                relations: {
                    Action: true,
                    Children: true,
                    ParentNode: true,
                    Schema: true,
                }
            });
            if (!node) {
                ErrorHandler.throwNotFoundError('Node not found!');
            }
            if (model.SchemaId != null) {
                const schema = await this._commonUtils.getSchema(model.SchemaId);
                node.Schema = schema;
            }
            if (model.ParentNodeId != null) {
                const parentNode = await this.getNode(model.ParentNodeId);
                node.ParentNode = parentNode;
            }
            if (model.Name != null) {
                node.Name = model.Name;
            }
            if (model.Description != null) {
                node.Description = model.Description;
            }
            if (model.Action != null) {
                const defaultAction = await this.updateAction(node.Action.id, model.Action);
                node.Action = defaultAction;
            }
            var record = await this._nodeRepository.save(node);
            return NodeMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._nodeRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._nodeRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: NodeSearchFilters) => {

        var search : FindManyOptions<Node> = {
            relations : {
            },
            where : {
            },
            select : {
                id      : true,
                Name       : true,
                Description: true,
                Schema: {
                    id         : true,
                    Name       : true,
                    Description: true,
                },
                ParentNode       : {
                    id  : true,
                    Name: true,
                    Description: true,
                },
                Children: {
                    id          : true,
                    Name        : true,
                    Description : true,
                },
                Rules: {
                    id          : true,
                    Name        : true,
                    Description : true,
                },
                Action   : {
                    id          : true,
                    Name        : true,
                    Description : true,   
                },
                CreatedAt  : true,
                UpdatedAt  : true,
            }
        };

        if (filters.SchemaId) {
            search.where['Schema'].id = filters.SchemaId;
        }
        if (filters.ParentNodeId) {
            search.where['ParentNode'].id = filters.ParentNodeId;
        }
        if (filters.Name) {
            search.where['Name'] = Like(`%${filters.Name}%`);
        }

        return search;
    };

    //#endregion

    private async getNode(nodeId: uuid) {
        if (!nodeId) {
            return null;
        }
        const node = await this._nodeRepository.findOne({
            where: {
                id: nodeId
            }
        });
        if (!node) {
            ErrorHandler.throwNotFoundError('Node cannot be found');
        }
        return node;
    }

    private async updateAction(actionId: uuid, actionModel: any) {
        if (!actionId) {
            ErrorHandler.throwNotFoundError('Action cannot be found');
        }
        const action = await this._actionRepository.findOne({
            where: {
                id: actionId
            }
        });
        if (!action) {
            ErrorHandler.throwNotFoundError('Action cannot be found');
        }
        if(actionModel && actionModel.ActionType) {
            action.ActionType = actionModel.ActionType;
        }
        if(actionModel && actionModel.Name) {
            action.Name = actionModel.Name;
        }
        if(actionModel && actionModel.Description) {
            action.Description = actionModel.Description;
        }
        if(actionModel && actionModel.InputParams) {
            action.InputParams = actionModel.InputParams;
        }
        if(actionModel && actionModel.OutputParams && actionModel.OutputParams.Message) {
            action.OutputParams.Message = actionModel.OutputParams.Message;
        }
        if(actionModel && actionModel.OutputParams && actionModel.OutputParams.NextNodeId) {
            action.OutputParams.NextNodeId = actionModel.OutputParams.NextNodeId;
        }
        if(actionModel && actionModel.OutputParams && actionModel.OutputParams.Extra) {
            action.OutputParams.Extra = actionModel.OutputParams.Extra;
        }

        const updated = await this._actionRepository.save(action);
        return updated;
    }
}
