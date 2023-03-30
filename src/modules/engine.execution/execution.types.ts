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

    getFacts = (): string[] => {
        var facts: string[] = [];
        if (this.OperatorType === OperatorType.Composition) {
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

    id          : uuid;

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
            var f = r.RootCondition?.getFacts();
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

    id : uuid = uuidv4();

    Name: string | undefined;

    NodeId: uuid | undefined;

    ParentRuleId: uuid | undefined;

    RootCondition: CCondition | undefined;

    AllConditions: CCondition[];

    Action      : {
        ActionType  : EventActionType;
        Name        : string;
        Description?: string;
        Params      : EventActionParams;
    };

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

    ExecutionStatus     : ExecutionStatus = ExecutionStatus.Pending;

    UpdatedAt           : Date;

    ApplicableRule      : CRule | undefined;

    AvailableFacts      : any[] | undefined;

    UserId              : uuid | undefined;

    Rules               : CRule[] = [];

    public extractFacts = () => {
        var facts: string[] = [];
        for (var r of this.Rules) {
            var f = r.RootCondition?.getFacts();
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

    ContextId          : uuid;

    Nodes              : CNodeInstance[];

    FactNames          : string[];

    CurrentNodeInstance: CNodeInstance | undefined;

    RootNodeInstance   : CNodeInstance | undefined;

    public setCurrent = (instance: CNodeInstance) => {
        this.CurrentNodeInstance = instance;
    };

}
