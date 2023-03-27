export type uuid    = string | null;
import { EventActionType, CompositionOperator, ExecutionStatus, LogicalOperator, MathematicalOperator, OperandDataType } from './../../domain.types/engine/engine.enums';
import { v4 as uuidv4 } from 'uuid';

export class Condition {
    id               : uuid = uuidv4();
    ParentConditionId: uuid | undefined;
    RuleId           : uuid | undefined;
    IsComposite      : boolean | undefined;
    Children         : Condition[] = [];
    Fact             : string | undefined;
    Operator         : LogicalOperator | MathematicalOperator | CompositionOperator | undefined;
    DataType         : OperandDataType | undefined = OperandDataType.Text;
    Value            : string | number | boolean | [] | undefined;

    static createComposite(ruleId: uuid, parentCondition: Condition | undefined | null, operator: CompositionOperator) {

        var condition = new Condition();

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
        parentCondition: Condition | undefined | null,
        fact:string,
        operator: LogicalOperator,
        dataType:OperandDataType,
        value: string | number | boolean | []) {
        var condition = new Condition();
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

export class Node {
    id          : uuid = uuidv4();
    SchemaId    : uuid;
    ParentNodeId: uuid | undefined;
    Name        : string | undefined;
    Description : string | undefined;
    Rules       : Rule[] = [];

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

export interface EventActionParams {
    Message   : string;
    Action    : EventActionType,
    NextNodeId: uuid | undefined;
    Extra?    : any | undefined;
}

export class EventAction {
    id          : uuid = uuidv4();
    ParentRuleId: uuid | undefined;
    Type        : string | undefined;
    Name        : string | undefined;
    Description : string | undefined;
    Params      : EventActionParams;

    constructor(
        parentRuleId: uuid,
        name:string,
        description: string,
        params: EventActionParams) {
            this.id = uuidv4();
            this.ParentRuleId = parentRuleId;
            this.Name = name;
            this.Description = description;
            this.Params = params;
        }
}

export class Rule {
    id          : uuid = uuidv4();
    Name        : string | undefined;
    NodeId      : uuid | undefined;
    Condition   : Condition | undefined;
    Event       : EventAction | undefined | null;

    constructor(
        nodeId: uuid,
        name:string,
        composition: CompositionOperator,
        event: EventAction | undefined | null = null) {
            this.id = uuidv4();
            this.NodeId = nodeId;
            this.Name = name;
            this.Event = event;
            this.Condition = Condition.createComposite(this.id, null, composition);
        }
}

export class Schema {
    id          : uuid = uuidv4();
    Name        : string | undefined;
    Nodes       : Node[];
    RootNode    : Node | undefined;

    constructor(name: string) {
        this.id = uuidv4();
        this.Nodes = [];
        this.Name = name;
    }
}

export class NodeExecutionInstance extends Node {
    id            : uuid = uuidv4();
    NodeId        : uuid | undefined;
    Status        : ExecutionStatus = ExecutionStatus.Pending;
    UpdatedAt     : Date;
    ApplicableRule: Rule | undefined;
    AvailableFacts: any[] | undefined;
    UserId        : uuid | undefined;

    constructor(node: Node) {
        super(node.SchemaId, node.ParentNodeId as uuid, node.Name as string, node.Description as string)
        this.id = uuidv4();
        this.NodeId = node.id;
        this.UpdatedAt = new Date();
        this.Rules = [];
        for (var r of node.Rules){
            var rule = {...r};
            this.Rules.push(rule);
        }
    }
}

export class SchemaExecutionInstance extends Schema {
    id                 : uuid = uuidv4();
    SchemaId           : uuid;
    Nodes              : NodeExecutionInstance[];
    CurrentNodeInstance: NodeExecutionInstance | undefined;
    RootNode           : NodeExecutionInstance | undefined;

    constructor(schema: Schema) {
        super(schema.Name as string);
        this.id = uuidv4();
        this.SchemaId = schema.id;
        this.Nodes = [];
        for (var n of schema.Nodes){
            var nodeInstance = new NodeExecutionInstance(n);
            this.Nodes.push(nodeInstance);
        }
        this.RootNode = this.Nodes.find(x => x.NodeId === schema.RootNode?.id);
    }

    public setCurrent = (instance: NodeExecutionInstance) => {
        this.CurrentNodeInstance = instance;
    }
}
