import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";

export interface ClientCreateModel {
    Name         : string;
    Code?        : string;
    IsPrivileged?: boolean;
    CountryCode  : string;
    Phone        : string;
    Email        : string;
    Password     : string;
    ApiKey?      : string;
    ValidFrom    : Date;
    ValidTill    : Date;
}

export interface ClientUpdateModel {
    Name        ?: string;
    Code        ?: string;
    IsPrivileged?: boolean;
    CountryCode ?: string;
    Phone       ?: string;
    Email       ?: string;
    Password    ?: string;
    ApiKey      ?: string;
    ValidFrom   ?: Date;
    ValidTill   ?: Date;
}

export interface ClientResponseDto {
    id          : uuid;
    Name        : string;
    Code        : string;
    IsPrivileged: boolean;
    CountryCode : string;
    Phone       : string;
    Email       : string;
    ValidFrom   : Date;
    ValidTill   : Date;
    IsActive    : boolean;
}

export interface ClientSearchResponseDto {
    id          : uuid;
    Name        : string;
    Code        : string;
    IsPrivileged: boolean;
    CountryCode : string;
    Phone       : string;
    Email       : string;
    IsActive    : boolean;
}

export interface ClientVerificationModel {
    Code     : string;
    Password : string;
    ValidFrom: Date;
    ValidTill: Date;
}

export interface ClientApiKeyResponseDto {
    id       : string;
    Name     : string;
    Code     : string;
    ApiKey   : string;
    ValidFrom: Date;
    ValidTill: Date;
}

export interface ClientSearchFilters extends BaseSearchFilters {
    Name ?            : string;
    Code ?            : string;
    IsPrivileged?     : boolean;
    CountryCode?      : string;
    Phone?            : string;
    Email?            : string;
}

export interface ClientSearchResults extends BaseSearchResults {
    Items: ClientSearchResponseDto[];
}
