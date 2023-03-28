import { IncomingEventType } from "../../database/models/engine/incoming.event.type.model";
import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";
import { IncomingEventTypeResponseDto } from "./incoming.event.type.types";

//////////////////////////////////////////////////////////////

export interface SchemaCreateModel {
    ClientId     : uuid;
    Name         : string;
    Description? : string;
    ValidFrom   ?: Date;
    ValidTill   ?: Date;
    IsValid     ?: boolean;
    EventTypeIds?: uuid[];
}

export interface SchemaUpdateModel {
    ClientId?    : uuid;
    Name?        : string;
    Description? : string;
    ValidFrom   ?: Date;
    ValidTill   ?: Date;
    IsValid     ?: boolean;
    EventTypeIds?: uuid[];
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
    EventTypes ?: IncomingEventTypeResponseDto[];
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
