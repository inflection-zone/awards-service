import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import { uuid } from "../miscellaneous/system.types";
import { ContextType } from "./engine.types";

////////////////////////////////////////////////////////////

export interface ContextCreateModel {
    ReferenceId : uuid;
    Type       ?: ContextType;
}

export interface ContextResponseDto {
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
    CreatedAt  : Date;
    UpdatedAt  : Date;
}

export interface ContextSearchFilters extends BaseSearchFilters {
    Type       ?: ContextType;
    ReferenceId?: uuid;
}

export interface ContextSearchResults extends BaseSearchResults {
    Items: ContextResponseDto[];
}
