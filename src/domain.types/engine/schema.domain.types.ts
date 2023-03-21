import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";

//////////////////////////////////////////////////////////////

export interface SchemaCreateModel {
    ClientId     : uuid;
    Name         : string;
    Description? : string;
    ValidFrom   ?: Date;
    ValidTill   ?: Date;
    IsValid     ?: boolean;
}

export interface SchemaUpdateModel {
    ClientId?    : uuid;
    Name?        : string;
    Description? : string;
    ValidFrom   ?: Date;
    ValidTill   ?: Date;
    IsValid     ?: boolean;
}

export interface SchemaResponseDto {
    id         : uuid;
    Name       : string;
    Description: string;
    ValidFrom  : Date;
    ValidTill  : Date;
    IsValid    : boolean;
    RootNodeId : uuid;
    Client     : {
        id  : uuid;
        Name: string;
        Code: string;
    };
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface SchemaSearchFilters extends BaseSearchFilters {
    Name ?     : string;
    ClientId ? : uuid;
}

export interface SchemaSearchResults extends BaseSearchResults {
    Items: SchemaResponseDto[];
}
