import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";

//////////////////////////////////////////////////////////////

export interface BadgeCreateModel {
    CategoryId   : uuid;
    ClientId     : uuid;
    Name         : string;
    Description? : string;
    ImageUrl     : string;
}

export interface BadgeUpdateModel {
    CategoryId?  : uuid;
    ClientId?    : uuid;
    Name?        : string;
    Description? : string;
    ImageUrl?    : string;
    HowToEarn?   : string;
}

export interface BadgeResponseDto {
    id          : uuid;
    Name        : string;
    Description : string;
    ImageUrl    : string;
    HowToEarn   : string;
    Category    : {
        id          : uuid;
        Name        : string;
        Description : string;
    };
    Client: {
        id   : uuid;
        Name : string;
        Code : string;
    };
    CreatedAt : Date;
    UpdatedAt : Date;
}

export interface BadgeSearchFilters extends BaseSearchFilters {
    Name ?       : string;
    CategoryId ? : uuid;
    ClientId ?   : uuid;
}

export interface BadgeSearchResults extends BaseSearchResults {
    Items: BadgeResponseDto[];
}
