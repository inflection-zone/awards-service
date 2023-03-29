export type uuid    = string | null;
import { EventActionParams } from '../../domain.types/engine/event.action.params';
import {
    CompositionOperator,
    EventActionType,
    ExecutionStatus,
    LogicalOperator,
    MathematicalOperator,
    OperandDataType,
    OperatorType
} from '../../domain.types/engine/engine.enums';
import { v4 as uuidv4 } from 'uuid';
import { SchemaInstanceResponseDto } from '../../domain.types/engine/schema.instance.types';
import { NodeInstanceResponseDto } from '../../domain.types/engine/node.instance.types';
import { RuleResponseDto } from '../../domain.types/engine/rule.domain.types';
import { ConditionResponseDto } from '../../domain.types/engine/condition.types';
import { NodeInstanceService } from '../../database/services/engine/node.instance.service';
import { RuleService } from '../../database/services/engine/rule.service';
import { SchemaInstanceService } from '../../database/services/engine/schema.instance.service';
import { SchemaService } from '../../database/services/engine/schema.service';
import { ConditionService } from '../../database/services/engine/condition.service';

///////////////////////////////////////////////////////////////////////////

export class CCondition {

    id               : uuid;

    ParentConditionId: uuid | undefined;

    RuleId           : uuid | undefined;

    Children         : CCondition[] = [];

    Fact             : string | undefined;

    OperatorType     : OperatorType;

    Operator         : LogicalOperator | MathematicalOperator | CompositionOperator | undefined;

    DataType         : OperandDataType | undefined = OperandDataType.Text;

    Value            : string | number | boolean | [] | undefined;

    constructor(cond: ConditionResponseDto) {
        this.id = cond.id;
        this.OperatorType = cond.Operator;
        this.RuleId = cond.Rule.id;
        this.ParentConditionId = cond.ParentCondition.id;
        this.Children = [];

        if (this.OperatorType === OperatorType.Composition) {
            this.Fact = undefined;
            this.Operator = cond.CompositionOperator;
            this.DataType = undefined;
            this.Value = undefined;
            for (var c of cond.ChildrenConditions) {
                const child = new ()
            }
        }
    }

    static createComposite(
        ruleId: uuid,
        parentCondition: CCondition | undefined | null,
        operator: CompositionOperator) {

        var condition = new CCondition();

        condition.id = uuidv4();
        condition.RuleId = ruleId;
        condition.ParentConditionId = parentCondition ? parentCondition.id : null;
        condition.IsComposite = true;
        condition.Fact = undefined;
        condition.Operator = operator;
        condition.DataType = undefined;
        condition.Value = undefined;

        if (parentCondition) {
            parentCondition?.Children.push(condition);
        }

        return condition;
    }

    static createLogical(
        ruleId: uuid,
        parentCondition: CCondition | undefined | null,
        fact:string,
        operator: LogicalOperator,
        dataType:OperandDataType,
        value: string | number | boolean | []) {
            
        var condition = new CCondition();
        condition.id = uuidv4();
        condition.RuleId = ruleId;
        condition.ParentConditionId = parentCondition ? parentCondition.id : null;
        condition.IsComposite = false;
        condition.Fact = fact;
        condition.Operator = operator;
        condition.DataType = dataType;
        condition.Value = value;

        if (parentCondition) {
            parentCondition?.Children.push(condition);
        }

        return condition;
    }

    getFacts = (): string[] => {
        var facts: string[] = [];
        if (this.IsComposite) {
            for (var c of this.Children) {
                var f = c.getFacts();
                facts.push(...f);
            }
        }
        else {
            if (this.Fact) {
                facts.push(this.Fact);
            }
        }
        return facts;
    };

}

export class CNode {

    id          : uuid = uuidv4();

    SchemaId    : uuid;

    ParentNodeId: uuid | undefined;

    Name        : string | undefined;

    Description : string | undefined;

    Rules       : CRule[] = [];

    constructor(
        schemaId: uuid,
        parentNodeId: uuid,
        name:string,
        description: string) {
        this.id = uuidv4();
        this.SchemaId = schemaId;
        this.ParentNodeId = parentNodeId;
        this.Name = name;
        this.Description = description;
        this.Rules = [];
    }

    public extractFacts = () => {
        var facts: string[] = [];
        for (var r of this.Rules) {
            var f = r.Condition?.getFacts();
            if (Array.isArray(f))
            {
                facts.push(...f);
            }
        }
        var s = new Set(facts);
        return Array.from(s);
    };

}

export class CRule {

    id          : uuid = uuidv4();

    Name        : string | undefined;

    NodeId      : uuid | undefined;

    Condition   : CCondition | undefined;

    ParentRuleId: uuid | undefined;

    Action      : {
        ActionType  : EventActionType;
        Name        : string;
        Description?: string;
        Params      : EventActionParams;
    };
    
    constructor(rule: RuleResponseDto) {
        this.id = rule.id;
        this.NodeId = rule.ParentNode.id;
        this.Name = rule.Name;
        this.Action = {
            ActionType  : rule.Action.ActionType,
            Name        : rule.Action.Name,
            Description : rule.Description,
            Params      : {
                Message    : rule.Action.Params.Message,
                Action     : rule.Action.Params.Action,
                NextNodeId : rule.Action.Params.NextNodeId,
                Extra      : rule.Action.Params.Extra,
            }
        };
        conditions = rule.
        this.Condition = new CCondition(rule.Condition);
    }

}

export class CNodeInstance {

    id                  : uuid;

    SchemaId            : uuid;

    SchemaInstanceId    : uuid;

    ParentNodeInstanceId: uuid | undefined;

    ParentNodeId        : uuid | undefined;

    NodeId              : uuid | undefined;

    Name                : string | undefined;

    Description         : string | undefined;

    Status              : ExecutionStatus = ExecutionStatus.Pending;

    UpdatedAt           : Date;

    ApplicableRule      : CRule | undefined;

    AvailableFacts      : any[] | undefined;

    UserId              : uuid | undefined;

    Rules               : CRule[] = [];

    // constructor(ni: NodeInstanceResponseDto) {
    //     this.id = ni.id;
    //     this.Name = ni.Node.Name;
    //     this.NodeId = ni.Node.id;
    //     this.SchemaId = ni.SchemaInstance.Schema.id;
    //     this.SchemaInstanceId = ni.SchemaInstance.id;
    //     this.ParentNodeId = ni.ParentNodeInstance?.Node?.id,
    //     this.ParentNodeInstanceId = ni.ParentNodeInstance?.id;
    //     this.UpdatedAt = new Date();
    //     this.Rules = [];
    //     for (var r of ni.Node.Rules) {
    //         const rule = new CRule(r);
    //         var rule = { ...r };
    //         this.Rules.push(rule);
    //     }
    // }

    public extractFacts = () => {
        var facts: string[] = [];
        for (var r of this.Rules) {
            var f = r.Condition?.getFacts();
            if (Array.isArray(f))
            {
                facts.push(...f);
            }
        }
        var s = new Set(facts);
        return Array.from(s);
    };

}

export class CSchema {

    id          : uuid = uuidv4();

    Name        : string | undefined;

    Nodes       : CNode[];

    RootNode    : CNode | undefined;

    constructor(name: string) {
        this.id = uuidv4();
        this.Nodes = [];
        this.Name = name;
    }

}

export class CSchemaInstance {

    id                 : uuid;

    Name               : string;

    SchemaId           : uuid;

    Nodes              : CNodeInstance[];

    CurrentNodeInstance: CNodeInstance | undefined;

    RootNodeInstance   : CNodeInstance | undefined;

    public setCurrent = (instance: CNodeInstance) => {
        this.CurrentNodeInstance = instance;
    };

}

export class ExecutionTypeGenerator {

    _nodeService = new NodeInstanceService();

    _nodeInstanceService = new NodeInstanceService();

    _ruleService = new RuleService();

    _schemaInstanceSerice = new SchemaInstanceService();

    _schemaService = new SchemaService();

    _conditionService = new ConditionService();


    public createSchemaInstance = async (dto: SchemaInstanceResponseDto): Promise<CSchemaInstance> => {

        const instance = new CSchemaInstance();
    
        instance.id = dto.id;
        instance.Name = dto.Schema.Name;
        instance.SchemaId = dto.Schema.id;
        instance.Nodes = [];
    
        const rootNodeId = dto.RootNodeInstance.Node.id;
    
        for (var ni of dto.NodeInstances) {
            const nodeInstance = await this.createNodeInstance(ni.id);
            instance.Nodes.push(nodeInstance);
        }
        instance.RootNodeInstance = instance.Nodes.find(x => x.NodeId === dto.RootNodeInstance.Node.id);
        instance.CurrentNodeInstance = instance.Nodes.find(x => x.NodeId === dto.CurrentNodeInstance.Node.id);

        return instance;
    }

    public createNodeInstance = async (nodeInstanceId: uuid)
        : Promise<CNodeInstance> => {

        const instance = new CNodeInstance();
        const dto = await this._nodeInstanceService.getById(nodeInstanceId);
        instance.id = dto.id;
        instance.Name = dto.Node.Name;
        instance.NodeId = dto.Node.id;
        instance.SchemaId = dto.SchemaInstance.Schema.id;
        instance.SchemaInstanceId = dto.SchemaInstance.id;
        instance.ParentNodeId = dto.ParentNodeInstance?.Node?.id,
        instance.ParentNodeInstanceId = dto.ParentNodeInstance?.id;
        instance.UpdatedAt = new Date();
        instance.Rules = [];
        instance.ApplicableRule = await this.createRule(dto.ApplicableRule.id);
        for (var r of dto.Node.Rules) {
            const rule = await this.createRule(r.id);
            instance.Rules.push(rule);
        }

        return instance;
    }

    public createRule = async (ruleId: uuid): Promise<CRule> => {

    }
}


