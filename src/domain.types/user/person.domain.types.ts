import { BaseSearchFilters } from "../miscellaneous/base.search.types";
import { Gender, uuid } from "../miscellaneous/system.types";

export interface PersonModel {
    ReferenceId?    : string;
    Prefix?         : string;
    FirstName?      : string;
    LastName?       : string;
    CountryCode?    : string;
    Phone?          : string;
    Email?          : string;
    Gender?         : Gender;
    BirthDate?      : Date;
    ProfileImageUrl?: string;
}

export interface PersonResponseDto {
    id             : uuid;
    ReferenceId    : string;
    Prefix         : string;
    FirstName      : string;
    LastName       : string;
    CountryCode    : string;
    Phone          : string;
    Email          : string;
    Gender         : Gender;
    BirthDate      : Date;
    ProfileImageUrl: string;
    CreatedAt      : Date;
    UpdatedAt      : Date;
}

export interface PersonSearchFilters extends BaseSearchFilters {
    Name  ?: string;
    Phone? : string;
    Email? : string;
}
