import {
    BaseSearchFilters,
    BaseSearchResults
} from "./miscellaneous/base.search.types";
import {
    uuid
} from "./miscellaneous/system.types";

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

export interface ClientDto {
    id: uuid;
    Name: string;
    Code: string;
    Phone: string;
    Email: string;

}

export interface ClientVerificationDomainModel {
    Code     : string;
    Password : string;
    ValidFrom: Date;
    ValidTill: Date;
}

export interface ClientApiKeyDto {
    id       : string;
    Name     : string;
    Code     : string;
    ApiKey   : string;
    ValidFrom: Date;
    ValidTill: Date;
}

export interface ClientSearchFilters extends BaseSearchFilters {
    Name ? : string;
    Code ? : string;
}

export interface ClientSearchResults extends BaseSearchResults {
    Items: ClientDto[];
}