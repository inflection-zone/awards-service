
import { ClientResponseDto } from "../client/client.domain.types";
import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { Gender, uuid } from "../miscellaneous/system.types";
import { RoleResponseDto } from "./role.domain.types";

export interface UserCreateModel {
    RoleId     : number;
    ClientId?  : uuid;
    UserName   : string;
    Prefix     : string;
    FirstName  : string;
    LastName   : string;
    CountryCode: string;
    Phone      : string;
    Email      : string;
    Gender     : Gender;
    BirthDate  : Date;
    Password   : string;
}

export interface UserUpdateModel {
    UserName?   : string;
    Prefix?     : string;
    FirstName?  : string;
    LastName?   : string;
    CountryCode?: string;
    Phone?      : string;
    Email?      : string;
    Gender?     : Gender;
    BirthDate?  : Date;
    ProfileImageUrl? : string;
}

export interface UserResponseDto {
    id         : uuid;
    Client    ?: ClientResponseDto;
    Role      ?: RoleResponseDto;
    UserName   : string;
    Prefix     : string;
    FirstName  : string;
    LastName   : string;
    CountryCode: string;
    Phone      : string;
    Email      : string;
    Gender     : Gender;
    BirthDate  : Date;
    CreatedAt  : Date;
    UpdatedAt  : Date;
}

export interface UserSearchFilters extends BaseSearchFilters {
    ClientId? : string;
    FirstName?: string;
    LastName? : string;
    Phone?    : string;
    Email?    : string;
}

export interface UserSearchResults extends BaseSearchResults {
    Items: UserResponseDto[];
}
