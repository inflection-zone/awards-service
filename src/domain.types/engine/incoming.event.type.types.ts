import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";

export interface IncomingEventTypeCreateModel {
    Name       : string;
    Description: string;
}

export interface IncomingEventTypeUpdateModel {
    Name        ?: string;
    Description ?: string;
}

export interface IncomingEventTypeResponseDto {
    id         : uuid;
    Name       : string;
    Description: string;
}

export interface IncomingEventTypeSearchFilters extends BaseSearchFilters {
    Name ?: string;
}

export interface IncomingEventTypeSearchResults extends BaseSearchResults {
    Items: IncomingEventTypeResponseDto[];
}
