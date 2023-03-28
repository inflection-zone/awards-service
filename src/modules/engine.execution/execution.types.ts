export type uuid    = string | null;
import { EventActionParams } from '../../domain.types/engine/event.action.params';
import { 
    CompositionOperator, 
    EventActionType, 
    ExecutionStatus, 
    LogicalOperator, 
    MathematicalOperator, 
    OperandDataType 
} from '../../domain.types/engine/engine.enums';
import { v4 as uuidv4 } from 'uuid';
import { SchemaInstanceResponseDto } from '../../domain.types/engine/schema.instance.types';
import { NodeInstanceResponseDto } from '../../domain.types/engine/node.instance.types';
import { RuleResponseDto } from '../../domain.types/engine/rule.domain.types';
import { ConditionResponseDto } from '../../domain.types/engine/condition.types';

///////////////////////////////////////////////////////////////////////////

export class CCondition {
    id               : uuid = uuidv4();
    ParentConditionId: uuid | undefined;
    RuleId           : uuid | undefined;
    IsComposite      : boolean | undefined;
    Children         : CCondition[] = [];
    Fact             : string | undefined;
    Operator         : LogicalOperator | MathematicalOperator | CompositionOperator | undefined;
    DataType         : OperandDataType | undefined = OperandDataType.Text;
    Value            : string | number | boolean | [] | undefined;

    constructor(cond: ConditionResponseDto) {

    }

    static createComposite(
        ruleId: uuid, 
        parentCondition: CCondition | undefined | null, 
        operator: CompositionOperator) {

        var condition = new CCondition();

        condition.id = uuidv4();
        condition.RuleId = ruleId;
        condition.ParentConditionId = parentCondition? parentCondition.id : null;
        condition.IsComposite = true;
        condition.Fact = undefined;
        condition.Operator = operator;
        condition.DataType = undefined;
        condition.Value = undefined;

        if(parentCondition) {
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
        condition.ParentConditionId = parentCondition? parentCondition.id : null;
        condition.IsComposite = false;
        condition.Fact = fact;
        condition.Operator = operator;
        condition.DataType = dataType;
        condition.Value = value;

        if(parentCondition) {
            parentCondition?.Children.push(condition);
        }

        return condition;
    }

    getFacts = (): string[] => {
        var facts: string[] = [];
        if (this.IsComposite) {
            for(var c of this.Children) {
                var f = c.getFacts();
                facts.push(...f);
            }
        }
        else {
            if(this.Fact) {
                facts.push(this.Fact);
            }
        }
        return facts;
    }
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
        for(var r of this.Rules) {
            var f = r.Condition?.getFacts();
            if(Array.isArray(f))
            {
                facts.push(...f);
            }
        }
        var s = new Set(facts);
        return Array.from(s);
    }
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
            ActionType : rule.Action.ActionType,
            Name : rule.Action.Name,
            Description: rule.Description,
            Params : {
                Message: rule.Action.Params.Message,
                Action : rule.Action.Params.Action,
                NextNodeId: rule.Action.Params.NextNodeId,
                Extra: rule.Action.Params.Extra,
            }
        }
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

    constructor(ni: NodeInstanceResponseDto) {
        this.id = ni.id;
        this.Name = ni.Node.Name;
        this.NodeId = ni.Node.id;
        this.SchemaId = ni.SchemaInstance.Schema.id;
        this.SchemaInstanceId = ni.SchemaInstance.id;
        this.ParentNodeId = ni.ParentNodeInstance?.Node?.id,
        this.ParentNodeInstanceId = ni.ParentNodeInstance?.id;
        this.UpdatedAt = new Date();
        this.Rules = [];
        for (var r of ni.Node.Rules) {
            const rule = new CRule(r)
            var rule = {...r};
            this.Rules.push(rule);
        }
    }

    public extractFacts = () => {
        var facts: string[] = [];
        for(var r of this.Rules) {
            var f = r.Condition?.getFacts();
            if(Array.isArray(f))
            {
                facts.push(...f);
            }
        }
        var s = new Set(facts);
        return Array.from(s);
    }

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
    RootNode           : CNodeInstance | undefined;

    constructor(si: SchemaInstanceResponseDto) {

        this.id = si.id;
        this.SchemaId = si.Schema.id;
        this.Nodes = [];
        for (var ni of si.NodeInstances) {
            var nodeInstance = new CNodeInstance(ni);
            this.Nodes.push(nodeInstance);
        }
        this.RootNode = this.Nodes.find(x => x.NodeId === schema.RootNode?.id);
    }

    public setCurrent = (instance: CNodeInstance) => {
        this.CurrentNodeInstance = instance;
    }
}
