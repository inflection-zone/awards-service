import {
    BaseSearchFilters,
    BaseSearchResults
} from "./miscellaneous/base.search.types";
import {
    uuid
} from "./miscellaneous/system.types";
type Gender = "male" | "female";
export interface ParticipantCreateModel {
    ClientId ? : uuid;
    FirstName ? : string;
    LastName ? : string;
    Phone ? : string;
    Email ? : string;
    Gender: Gender;
    BirthDate ? : Date;
}

export interface ParticipantUpdateModel {
    ClientId ? : uuid;
    FirstName ? : string;
    LastName ? : string;
    Phone ? : string;
    Email ? : string;
    Gender ? : Gender;
    BirthDate ? : Date;
}

export interface ParticipantDto {
    id: uuid;
    ClientId: uuid;
    FirstName: string;
    LastName: string;
    Phone: string;
    Email: string;
    Gender: Gender;
    BirthDate: Date;

}

export interface ParticipantSearchFilters extends BaseSearchFilters {
    ClientId ? : uuid;
    FirstName ? : string;
    LastName ? : string;
    Gender ? : Gender;
    BirthDate ? : Date;
}

export interface ParticipantSearchResults extends BaseSearchResults {
    Items: ParticipantDto[];
}