import {
    BaseSearchFilters,
    BaseSearchResults
} from "./miscellaneous/base.search.types";
import {
    uuid
} from "./miscellaneous/system.types";
type Gender = "male" | "female";
export interface ParticipantCreateModel {
    ClientId        : uuid;
    ReferenceId     : string | number;
    FirstName ?     : string;
    LastName  ?     : string;
    Phone     ?     : string;
    Email     ?     : string;
    Gender          : Gender;
    BirthDate ?     : Date;
}

export interface ParticipantUpdateModel {
    ClientId       ?: uuid;
    ReferenceId    ?: string | number;
    FirstName ?: string;
    LastName  ?: string;
    Phone     ?: string;
    Email     ?: string;
    Gender    ?: Gender;
    BirthDate ?: Date;
}

export interface ParticipantResponseDto {
    id         : uuid;
    ClientId   : uuid;
    ReferenceId: string | number;
    FirstName  : string;
    LastName   : string;
    Phone      : string;
    Email      : string;
    Gender     : Gender;
    BirthDate  : Date;
}

export interface ParticipantSearchFilters extends BaseSearchFilters {
    ClientId    ?: uuid;
    ReferenceId ?: string | number;
    FirstName   ?: string;
    LastName    ?: string;
    Gender      ?: Gender;
    BirthDate   ?: Date;
}

export interface ParticipantSearchResults extends BaseSearchResults {
    Items: ParticipantResponseDto[];
}
