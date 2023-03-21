import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";

//////////////////////////////////////////////////////////////

export interface BadgeCategoryCreateModel {
    ClientId     : uuid;
    Name         : string;
    Description? : string;
    ImageUrl     : string;
}

export interface BadgeCategoryUpdateModel {
    ClientId?    : uuid;
    Name?        : string;
    Description? : string;
    ImageUrl?    : string;
}

export interface BadgeCategoryResponseDto {
    id         : uuid;
    Name       : string;
    Description: string;
    ImageUrl   : string;
    Client: {
        id  : uuid;
        Name: string;
        Code: string;
    };
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface BadgeCategorySearchFilters extends BaseSearchFilters {
    Name ?       : string;
    ClientId ?   : uuid;
}

export interface BadgeCategorySearchResults extends BaseSearchResults {
    Items: BadgeCategoryResponseDto[];
}
