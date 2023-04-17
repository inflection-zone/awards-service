import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import { uuid } from "../miscellaneous/system.types";
import { ContextType } from "./engine.types";

////////////////////////////////////////////////////////////

export interface IncomingEventCreateModel {
    TypeId     : uuid;
    ReferenceId: uuid;
    Payload    : any;
}

export interface IncomingEventUpdateModel {
    TypeId     ?: uuid;
    ReferenceId?: uuid;
}

export interface IncomingEventResponseDto {
    id: uuid;
    EventType: {
        id         : uuid;
        Name       : string;
        Description: string;
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
    ReferenceId: uuid;
    Payload    : any;
    CreatedAt  : Date;
    UpdatedAt  : Date;
}

export interface IncomingEventSearchFilters extends BaseSearchFilters {
    TypeId     ?: uuid;
    ReferenceId?: uuid;
}

export interface IncomingEventSearchResults extends BaseSearchResults {
    Items: IncomingEventResponseDto[];
}
