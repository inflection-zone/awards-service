
import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { PrivilegeResponseDto } from "./privilege.domain.types";

export interface RoleCreateModel {
    Name       : string;
    Description: string;
}

export interface RoleUpdateModel {
    Name       ?: string;
    Description?: string;
}

export interface RoleResponseDto {
    id         : number;
    Name       : string;
    Description: string;
    Privileges : PrivilegeResponseDto[];
    CreatedAt  : Date;
    UpdatedAt  : Date;
}

export interface RoleSearchFilters extends BaseSearchFilters {
    Name ?: string;
}

export interface RoleSearchResults extends BaseSearchResults {
    Items: RoleResponseDto[];
}
