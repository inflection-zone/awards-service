import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";
import { ContextType, EventActionType, ExecutionStatus, InputParams, NodeType, OperandDataType, OperatorType, OutputParams } from "./engine.types";

//////////////////////////////////////////////////////////////

export interface NodeInstanceCreateModel {
    NodeId          : uuid;
    SchemaInstanceId: uuid;
}

export interface NodeInstanceUpdateModel {
    NodeId           ?: uuid;
    SchemaInstanceId ?: uuid;
}

export interface NodeInstanceResponseDto {
    id         : uuid;
    ExecutionStatus : ExecutionStatus;
    StatusUpdateTimestamp : Date;
    ApplicableRule: {
        id         : uuid;
        Name       : string;
        Description: string;
    };
    AvailableFacts       : any[];
    ExecutedDefaultAction: boolean;
    ExecutionResult      : any;
    Node                 : {
        id    : uuid;
        Type  : NodeType;
        Name  : string;
        Action: {
            id           : uuid;
            Name         : string;
            ActionType   : EventActionType;
            InputParams  : InputParams;
            OutputParams : OutputParams;
        } | null,
        Rules: {
            id    : uuid,
            Name  : string;
            Action: {
                id        : uuid;
                Name      : string;
                ActionType: EventActionType;
                InputParams  : InputParams;
                OutputParams : OutputParams;
            },
            Condition: {
                id      : uuid;
                Name    : string;
                Operator: OperatorType,
                DataType: OperandDataType,
                Fact    : string;
            }
        }[],
    };
    SchemaInstance : {
        id    : uuid;
        Schema: {
            id         : uuid;
            Name       : string;
            Description: string;
        };
    };
    Context : {
        id          : uuid;
        ReferenceId : uuid;
        Type        : ContextType;
        Participant?: {
            id         : uuid;
            ReferenceId: uuid;
            Prefix     : string;
            FirstName  : string;
            LastName   : string;
        };
        ParticipantGroup ?: {
            id         : uuid;
            Name       : string;
            Description: string;
        };
    };
    ParentNodeInstance : {
        id: uuid;
        Node: {
            id: uuid;
            Name: string;
        };
    } | null;
    ChildrenNodeInstances : {
        id  : uuid;
        Node: {
            id: uuid;
            Name: string;
        };
    }[];
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface NodeInstanceSearchFilters extends BaseSearchFilters {
    NodeId           ?: uuid;
    SchemaInstanceId ?: uuid;
}

export interface NodeInstanceSearchResults extends BaseSearchResults {
    Items: NodeInstanceResponseDto[];
}
