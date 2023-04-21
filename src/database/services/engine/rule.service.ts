import { Rule } from '../../models/engine/rule.model';
import { Node } from '../../models/engine/node.model';
import { RuleAction } from '../../models/engine/rule.action.model';
import { Condition } from '../../models/engine/condition.model';
import { logger } from '../../../logger/logger';
import { ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../../database/database.connector';
import { FindManyOptions, Like, Repository } from 'typeorm';
import { RuleMapper } from '../../mappers/engine/rule.mapper';
import { BaseService } from '../base.service';
import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { 
    RuleCreateModel, 
    RuleResponseDto, 
    RuleSearchFilters, 
    RuleSearchResults, 
    RuleUpdateModel } from '../../../domain.types/engine/rule.domain.types';
import { CompositionOperator, OperatorType } from '../../../domain.types/engine/engine.types';

///////////////////////////////////////////////////////////////////////

export class RuleService extends BaseService {

    //#region Repositories

    _ruleRepository: Repository<Rule> = Source.getRepository(Rule);

    _nodeRepository: Repository<Node> = Source.getRepository(Node);

    _conditionRepository: Repository<Condition> = Source.getRepository(Condition);

    _actionRepository: Repository<RuleAction> = Source.getRepository(RuleAction);

    //#endregion

    public create = async (createModel: RuleCreateModel)
        : Promise<RuleResponseDto> => {

        const action = await this.createAction(createModel.Action);
        const parentNode = await this.getNode(createModel.ParentNodeId);

        const rule = this._ruleRepository.create({
            ParentNode : parentNode,
            Name       : createModel.Name,
            Description: createModel.Description,
            Action   : action,
        });
        var record = await this._ruleRepository.save(rule);

        const condition = await this._conditionRepository.create({
            Name : `Rule-${rule.Name}-RootCondition`,
            Rule : record,
            Operator : OperatorType.Composition,
            CompositionOperator : CompositionOperator.And,
        });
        var conditionRecord = await this._conditionRepository.save(condition);

        rule.Condition = condition;
        record = await this._ruleRepository.save(rule);

        return RuleMapper.toResponseDto(record);
    };

    public getById = async (id: uuid): Promise<RuleResponseDto> => {
        try {
            var rule = await this._ruleRepository.findOne({
                where : {
                    id : id
                },
                select : {
                    id         : true,
                    Name       : true,
                    Description: true,
                    ParentNode : {
                        id         : true,
                        Name       : true,
                        Description: true,
                    },
                    Action: {
                        id          : true,
                        Name        : true,
                        ActionType  : true,
                        InputParams : {},
                        OutputParams: {},
                    },
                    Condition: {
                        id      : true,
                        Name    : true,
                        Operator: true,
                    },
                    CreatedAt  : true,
                    UpdatedAt  : true,
                }
            });
            return RuleMapper.toResponseDto(rule);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public search = async (filters: RuleSearchFilters)
        : Promise<RuleSearchResults> => {
        try {
            var search = this.getSearchModel(filters);
            var { search, pageIndex, limit, order, orderByColumn } = this.addSortingAndPagination(search, filters);
            const [list, count] = await this._ruleRepository.findAndCount(search);
            const searchResults = {
                TotalCount     : count,
                RetrievedCount : list.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColumn,
                Items          : list.map(x => RuleMapper.toResponseDto(x)),
            };
            return searchResults;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwDbAccessError('DB Error: Unable to search records!', error);
        }
    };

    public update = async (id: uuid, model: RuleUpdateModel)
        : Promise<RuleResponseDto> => {
        try {
            const rule = await this._ruleRepository.findOne({
                where : {
                    id : id
                }
            });
            if (!rule) {
                ErrorHandler.throwNotFoundError('Rule not found!');
            }
            if (model.ParentNodeId != null) {
                const node = await this.getNode(model.ParentNodeId);
                rule.ParentNode = node;
            }
            if (model.Action != null) {
                const action = await this.updateAction(rule.Action.id, model.Action);
                rule.Action = action;
            }
            if (model.Name != null) {
                rule.Name = model.Name;
            }
            if (model.Description != null) {
                rule.Description = model.Description;
            }
            var record = await this._ruleRepository.save(rule);
            return RuleMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    public delete = async (id: string): Promise<boolean> => {
        try {
            var record = await this._ruleRepository.findOne({
                where : {
                    id : id
                }
            });
            var result = await this._ruleRepository.remove(record);
            return result != null;
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    //#region Privates

    private getSearchModel = (filters: RuleSearchFilters) => {

        var search : FindManyOptions<Rule> = {
            relations : {
            },
            where : {
            },
            select : {
                id         : true,
                Name       : true,
                Description: true,
                ParentNode : {
                    id         : true,
                    Name       : true,
                    Description: true,
                },
                Action: {
                    id         : true,
                    Name       : true,
                    ActionType : true,
                },
                Condition: {
                    id      : true,
                    Name    : true,
                    Operator: true,
                },
                CreatedAt  : true,
                UpdatedAt  : true,
            }
        };

        if (filters.ParentNodeId) {
            search.where['ParentNode'].id = filters.ParentNodeId;
        }
        if (filters.ConditionId) {
            search.where['Condition'].id = filters.ConditionId;
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

    private async createAction(actionModel: any) {
        const action = await this._actionRepository.create({
            ActionType: actionModel.ActionType,
            Name: actionModel.Name,
            Description: actionModel.Description,
            InputParams: actionModel.InputParams,
            OutputParams: actionModel.InputParams,
        });
        const record = await this._actionRepository.save(action);
        return record;
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
        if(actionModel && actionModel.OutputParams && actionModel.OutputParams.Message) {
            action.OutputParams.Message = actionModel.OutputParams.Message;
        }
        if(actionModel && actionModel.Params && actionModel.OutputParams.NextNodeId) {
            action.OutputParams.NextNodeId = actionModel.OutputParams.NextNodeId;
        }
        if(actionModel && actionModel.Params && actionModel.OutputParams.Extra) {
            action.OutputParams.Extra = actionModel.OutputParams.Extra;
        }

        const updated = await this._actionRepository.save(action);
        return updated;
    }
}
