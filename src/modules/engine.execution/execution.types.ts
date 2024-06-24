import { ActionOutputParams, InputParams, OutputParams } from '../../domain.types/engine/engine.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import {
    CompositionOperator,
    ContextType,
    EventActionType,
    ExecutionStatus,
    LogicalOperator,
    MathematicalOperator,
    NodeType,
    OperandDataType,
    OperatorType
} from '../../domain.types/engine/engine.types';
import { v4 as uuidv4 } from 'uuid';

///////////////////////////////////////////////////////////////////////////

export interface AlmanacObject {
    Name: string;
    Data: any[] | any;
}

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

export class CContext {

    id          : uuid;
    
    ReferenceId : uuid;

    Type        : ContextType;

    Participant?: {
        id       : uuid;
        FirstName: string;
        LastName : string;
    };

    ParticipantGroup ?: {
        id         : uuid;
        Name       : string;
        Description: string;
    };

}

export class CAction {

    id          : uuid;

    ActionType  : EventActionType;

    Name        : string | undefined;

    Description : string | undefined;

    ParentNodeId: uuid | undefined;

    InputParams : any;

    OutputParams: ActionOutputParams;

}

export class CNode {

    id          : uuid;

    Type        : NodeType;

    SchemaId    : uuid;

    ParentNodeId: uuid | undefined;

    Name        : string | undefined;

    Description : string | undefined;

    Rules       : CRule[] = [];

    Action : CAction = undefined;

    constructor(
        id: uuid,
        schemaId: uuid,
        parentNodeId: uuid,
        type: NodeType,
        name:string,
        description: string) {
        this.id = id;
        this.Type = type;
        this.SchemaId = schemaId;
        this.ParentNodeId = parentNodeId;
        this.Name = name;
        this.Description = description;
        this.Rules = [];
    }

    public extractFacts = () => {
        if (this.Rules.length > 0) {
            var facts: string[] = [];
            for (var r of this.Rules) {
                var f = r.RootCondition?.getFacts();
                if (Array.isArray(f)) {
                    facts.push(...f);
                }
            }
            var s = new Set(facts);
            return Array.from(s);
        }
        return [];
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
        ActionType   : EventActionType;
        InputParams ?: InputParams;
        Name         : string;
        Description ?: string;
        OutputParams : OutputParams;
    };

}

export class CNodeInstance {

    id                  : uuid;

    Type                : NodeType;

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

    Action              : CAction = undefined;

    public extractFacts = () => {
        if (this.Rules.length > 0) {
            var facts: string[] = [];
            for (var r of this.Rules) {
                var f = r.RootCondition?.getFacts();
                if (Array.isArray(f)) {
                    facts.push(...f);
                }
            }
            var s = new Set(facts);
            return Array.from(s);
        }
        return [];
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

    Context            : CContext;

    NodeInstances      : CNodeInstance[];

    FactNames          : string[];

    CurrentNodeInstance: CNodeInstance | undefined;

    RootNodeInstance   : CNodeInstance | undefined;

    Almanac            : AlmanacObject[];

    CSchemaInstance() {
        //
    }

    public setCurrent = (instance: CNodeInstance) => {
        this.CurrentNodeInstance = instance;
    };

    public fetchAlmanacData = (tag: string) => {
        return this.Almanac.find(x => x.Name === tag);
    };

}
