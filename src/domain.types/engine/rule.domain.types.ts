import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";
import { EventActionType, OperatorType } from "./engine.enums";

//////////////////////////////////////////////////////////////

export interface RuleCreateModel {
    Name        : string;
    Description?: string;
    ParentNodeId: uuid;
    SchemaId    : uuid;
    Action      : {
        ActionType  : EventActionType;
        Name        : string;
        Description?: string;
        Params      : {
            Message    : string;
            Action    ?: EventActionType;
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
        Name         ?: string;
        Description  ?: string;
        Params       ?: {
            Message   ?: string;
            Action    ?: EventActionType;
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
        id: uuid;
        Name: string;
        Description: string;
    }
    Condition : {
        id  : uuid;
        Name: string;
        Operator: OperatorType;
    };
    Action: {
        id: uuid;
        Name: string;
        Description: string;
        ActionType: EventActionType;
        Params: {
            Message    : string;
            Action     : EventActionType;
            NextNodeId : uuid;
            Extra      : any;
        }
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
