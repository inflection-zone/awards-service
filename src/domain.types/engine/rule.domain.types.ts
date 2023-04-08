import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";
import { EventActionType, OperatorType } from "./engine.enums";
import { EventActionParams } from "./event.action.params";

//////////////////////////////////////////////////////////////

export interface RuleCreateModel {
    Name        : string;
    Description?: string;
    ParentNodeId: uuid;
    SchemaId    : uuid;
    Action      : {
        ActionType    : EventActionType;
        ActionSubject?: any;
        Name          : string;
        Description  ?: string;
        Params        : {
            Message    : string;
            NextNodeId?: uuid;
            Extra     ?: any;
        }
    };
}

export interface RuleUpdateModel {
    Name         ?: string;
    Description  ?: string;
    ParentNodeId ?: uuid;
    SchemaId     ?: uuid;
    Action       ?: {
        ActionType   ?: EventActionType;
        ActionSubject?: any;
        Name         ?: string;
        Description  ?: string;
        Params       ?: {
            Message   ?: string;
            NextNodeId?: uuid;
            Extra     ?: any;
        }
    };
}

export interface RuleResponseDto {
    id         : uuid;
    Name       : string;
    Description: string;
    ParentNode : {
        id         : uuid;
        Name       : string;
        Description: string;
    }
    Condition : {
        id      : uuid;
        Name    : string;
        Operator: OperatorType;
    };
    Action: {
        id            : uuid;
        Name          : string;
        Description   : string;
        ActionType    : EventActionType;
        ActionSubject?: any;
        Params       ?: EventActionParams;
    },
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface RuleSearchFilters extends BaseSearchFilters {
    Name         ?: string;
    ParentNodeId ?: uuid;
    ConditionId  ?: uuid;
}

export interface RuleSearchResults extends BaseSearchResults {
    Items: RuleResponseDto[];
}
