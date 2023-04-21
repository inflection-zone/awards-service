import { SchemaInstanceResponseDto } from '../../domain.types/engine/schema.instance.types';
// import { NodeInstanceResponseDto } from '../../domain.types/engine/node.instance.types';
// import { RuleResponseDto } from '../../domain.types/engine/rule.domain.types';
import { ConditionResponseDto } from '../../domain.types/engine/condition.types';
import { NodeInstanceService } from '../../database/services/engine/node.instance.service';
import { RuleService } from '../../database/services/engine/rule.service';
import { SchemaInstanceService } from '../../database/services/engine/schema.instance.service';
import { SchemaService } from '../../database/services/engine/schema.service';
import { ConditionService } from '../../database/services/engine/condition.service';
import { OperatorType } from '../../domain.types/engine/engine.types';
import { CSchemaInstance, CNodeInstance, CRule, CCondition, CAction } from './execution.types';
import { logger } from '../../logger/logger';
import { uuid } from '../../domain.types/miscellaneous/system.types';

/////////////////////////////////////////////////////////////////////////////////

export class ExecutionTypesGenerator {

    _nodeService = new NodeInstanceService();

    _nodeInstanceService = new NodeInstanceService();

    _ruleService = new RuleService();

    _schemaInstanceSerice = new SchemaInstanceService();

    _schemaService = new SchemaService();

    _conditionService = new ConditionService();

    public createSchemaInstance = async (dto: SchemaInstanceResponseDto): Promise<CSchemaInstance> => {

        try {
            const instance = new CSchemaInstance();
        
            instance.id = dto.id;
            instance.Name = dto.Schema.Name;
            instance.SchemaId = dto.Schema.id;
            instance.NodeInstances = [];
            instance.FactNames = [];
            instance.Almanac = [];

            instance.Context = {
                id         : dto.Context.id,
                ReferenceId: dto.Context.ReferenceId,
                Type       : dto.Context.Type,
                Participant: dto.Context.Participant ? {
                    id : dto.Context.Participant.id,
                    FirstName: dto.Context.Participant.FirstName,
                    LastName: dto.Context.Participant.LastName,
                }: null,
                ParticipantGroup : dto.Context.ParticipantGroup ? {
                    id         : dto.Context.ParticipantGroup.id,
                    Name       : dto.Context.ParticipantGroup.Name,
                    Description: dto.Context.ParticipantGroup.Description,
                } : null
            };
        
            for await (var ni of dto.NodeInstances) {
                const nodeInstance = await this.createNodeInstance(ni.id);
                instance.NodeInstances.push(nodeInstance);
            }
            instance.RootNodeInstance = instance.NodeInstances.find(x => x.NodeId === dto.RootNodeInstance?.Node?.id);
            instance.CurrentNodeInstance = instance.NodeInstances.find(x => x.NodeId === dto.CurrentNodeInstance?.Node?.id);

            for (var nodeInstance of instance.NodeInstances) {
                var facts = nodeInstance.extractFacts();
                if (facts.length > 0) {
                    instance.FactNames.push(...facts);
                }
            }

            return instance;
        }
        catch (error) {
            logger.error(`${error.message}`);
        }
    };

    public createNodeInstance = async (nodeInstanceId: uuid)
        : Promise<CNodeInstance> => {

        const instance = new CNodeInstance();

        const dto = await this._nodeInstanceService.getById(nodeInstanceId);

        instance.id = dto.id;
        instance.Type = dto.Node.Type;
        instance.Name = dto.Node.Name;
        instance.NodeId = dto.Node.id;
        instance.SchemaId = dto.SchemaInstance.Schema.id;
        instance.SchemaInstanceId = dto.SchemaInstance.id;
        instance.ParentNodeId = dto.ParentNodeInstance?.Node?.id ?? null,
        instance.ParentNodeInstanceId = dto.ParentNodeInstance?.id ?? null;
        instance.UpdatedAt = new Date();
        if (dto.ApplicableRule) {
            instance.ApplicableRule = await this.createRule(dto.ApplicableRule.id);
        }
        instance.AvailableFacts = dto.AvailableFacts;
        instance.ExecutionStatus = dto.ExecutionStatus;

        instance.Rules = [];
        for (var r of dto.Node.Rules) {
            const rule = await this.createRule(r.id);
            instance.Rules.push(rule);
        }

        if (dto.Node.Action) {

            const action = dto.Node.Action;

            instance.Action              = new CAction();
            instance.Action.id           = action.id;
            instance.Action.ActionType   = action.ActionType;
            instance.Action.InputParams  = action.InputParams;
            instance.Action.Name         = action.Name;
            instance.Action.OutputParams = action.OutputParams;
            instance.Action.ParentNodeId = dto.Node.id;
        }

        return instance;
    };

    public createRule = async (ruleId: uuid): Promise<CRule> => {
        const instance = new CRule();
        const rule = await this._ruleService.getById(ruleId);

        instance.id = rule.id;
        instance.NodeId = rule.ParentNode.id;
        instance.Name = rule.Name;
        instance.Action = {
            ActionType  : rule.Action.ActionType,
            Name        : rule.Action.Name,
            Description : rule.Description,
            InputParams  : rule.Action.InputParams,
            OutputParams      : rule.Action.OutputParams
        };

        const conds = await this.getConditionsForRule(rule.id);
        instance.AllConditions = conds;

        const rootCondition = await this._conditionService.getById(rule.Condition.id);
        instance.RootCondition = await this.createCondition(rootCondition);

        return instance;
    };

    public getConditionsForRule = async (ruleId: uuid): Promise<CCondition[]> => {
        const conditions:CCondition[] = [];
        var conds = await this._conditionService.getConditionsForRule(ruleId);
        for await (var c of conds) {
            const condition = await this.createCondition(c);
            conditions.push(condition);
        }
        return conditions;
    };

    public createCondition = async (dto: ConditionResponseDto): Promise<CCondition> => {

        const condition = new CCondition();

        condition.id = dto.id;
        condition.OperatorType = dto.Operator;
        condition.RuleId = dto.Rule.id;
        condition.ParentConditionId = dto.ParentCondition ? dto.ParentCondition.id : null;
        condition.Children = [];

        if (condition.OperatorType === OperatorType.Composition) {
            condition.Fact = undefined;
            condition.Operator = dto.CompositionOperator;
            condition.DataType = undefined;
            condition.Value = undefined;
            for await (var c of dto.ChildrenConditions) {
                const child = await this._conditionService.getById(c.id);
                const childCondition = await this.createCondition(child);
                condition.Children.push(childCondition);
            }
        }
        else if (condition.OperatorType === OperatorType.Logical) {
            condition.Operator = dto.LogicalOperator;
            condition.Fact = dto.Fact;
            condition.DataType = dto.DataType;
            condition.Value = dto.Value;
        }
        else {
            //Nothing to do for now...
        }

        return condition;
    };

}

