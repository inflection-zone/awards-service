import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import { uuid } from "../miscellaneous/system.types";
import { ContextType } from "./enums";

////////////////////////////////////////////////////////////

export interface IncomingEventCreateModel {
    IncomingEventTypeId: uuid;
    ReferenceId        : uuid;
}

export interface IncomingEventUpdateModel {
    IncomingEventTypeId ?: uuid;
    ReferenceId         ?: uuid;
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
    CreatedAt  : Date;
    UpdatedAt  : Date;
}

export interface IncomingEventSearchFilters extends BaseSearchFilters {
    IncomingEventTypeId?: uuid;
    ReferenceId        ?: uuid;
}

export interface IncomingEventSearchResults extends BaseSearchResults {
    Items: IncomingEventResponseDto[];
}
