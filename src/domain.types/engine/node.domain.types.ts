import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";
import { EventActionType } from "./enums";

//////////////////////////////////////////////////////////////

export interface NodeCreateModel {
    Name            : string;
    Description?    : string;
    ParentNodeId    : uuid;
    SchemaId        : uuid;
    DefaultActionId?: uuid;
}

export interface NodeUpdateModel {
    Name            ?: string;
    Description     ?: string;
    ParentNodeId    ?: uuid;
    SchemaId        ?: uuid;
    DefaultActionId ?: uuid;
}

export interface NodeResponseDto {
    id         : uuid;
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
    DefaultAction: {
        id: uuid;
        Name: string;
        Description: string;
        ActionType: EventActionType;
    } | null,
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface NodeSearchFilters extends BaseSearchFilters {
    Name         ?: string;
    ParentNodeId ?: uuid;
    SchemaId     ?: uuid;
}

export interface NodeSearchResults extends BaseSearchResults {
    Items: NodeResponseDto[];
}
