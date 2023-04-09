import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";
import { EventActionType, NodeType } from "./engine.enums";

//////////////////////////////////////////////////////////////

export interface NodeCreateModel {
    Type         : NodeType;
    Name         : string;
    Description? : string;
    ParentNodeId : uuid;
    SchemaId     : uuid;
    Action: {
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

export interface NodeUpdateModel {
    Type            ?: NodeType;
    Name            ?: string;
    Description     ?: string;
    ParentNodeId    ?: uuid;
    SchemaId        ?: uuid;
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

export interface NodeResponseDto {
    id         : uuid;
    Type       : NodeType;
    Name       : string;
    Description: string;
    ParentNode : {
        id: uuid;
        Name: string;
        Description: string;
    }
    Children     : {
        id  : uuid;
        Name: string;
        Description: string;
    }[];
    Schema     : {
        id  : uuid;
        Name: string;
        Description: string;
    };
    Rules : {
        id: uuid;
        Name: string;
        Description: string;
    }[];
    Action: {
        id           : uuid;
        Name         : string;
        ActionSubject: any;
        Description  : string;
        ActionType   : EventActionType;
        Params       : {
            Message    : string;
            NextNodeId : uuid;
            Extra      : any;
        }
    } | null,
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface NodeSearchFilters extends BaseSearchFilters {
    Type         ?: NodeType;
    Name         ?: string;
    ParentNodeId ?: uuid;
    SchemaId     ?: uuid;
}

export interface NodeSearchResults extends BaseSearchResults {
    Items: NodeResponseDto[];
}
