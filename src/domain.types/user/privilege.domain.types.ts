
import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { uuid } from "../miscellaneous/system.types";

export interface PrivilegeCreateModel {
    Name        : string;
    Description?: string;
}

export interface PrivilegeUpdateModel {
    Name       ?: string;
    Description?: string;
}

export interface PrivilegeResponseDto {
    id         : uuid;
    Name       : string;
    Description: string;
    CreatedAt  : Date;
    UpdatedAt  : Date;
}

export interface PrivilegeSearchFilters extends BaseSearchFilters {
    Name ?: string;
}

export interface PrivilegeSearchResults extends BaseSearchResults {
    Items: PrivilegeResponseDto[];
}
