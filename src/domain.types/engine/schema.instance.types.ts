import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";
import { ContextType } from "./engine.types";

//////////////////////////////////////////////////////////////

export interface SchemaInstanceCreateModel {
    SchemaId  : uuid;
    ContextId : uuid;
}

export interface SchemaInstanceUpdateModel {
    SchemaId  ?: uuid;
    ContextId ?: uuid;
}

export interface SchemaInstanceResponseDto {
    id         : uuid;
    Schema     : {
        id         : uuid;
        Name       : string;
        Description: string;
        Client     : {
            id  : uuid;
            Name: string;
        },
        EventTypes : {
            id: uuid;
            Name: string;
            Description: string;
        }[],
    };
    Context     : {
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
    RootNodeInstance : {
        id: uuid;
        Node: {
            id: uuid;
            Name: string;
        }
    };
    CurrentNodeInstance : {
        id: uuid;
        Node: {
            id: uuid;
            Name: string;
        }
    };
    NodeInstances : {
        id: uuid;
        Node: {
            id: uuid;
            Name: string;
        }
    }[];
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface SchemaInstanceSearchFilters extends BaseSearchFilters {
    SchemaId  ?: uuid;
    ContextId ?: uuid;
}

export interface SchemaInstanceSearchResults extends BaseSearchResults {
    Items: SchemaInstanceResponseDto[];
}
