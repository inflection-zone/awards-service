import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";

//////////////////////////////////////////////////////////////

export interface ParticipantGroupCreateModel {
    ClientId     : uuid;
    ReferenceId? : uuid;
    Name         : string;
    Description? : string;
    ImageUrl     : string;
}

export interface ParticipantGroupUpdateModel {
    ClientId     : uuid;
    Name?        : string;
    ReferenceId? : uuid;
    Description? : string;
    ImageUrl?    : string;
}

export interface ParticipantGroupResponseDto {
    id         : uuid;
    ReferenceId: uuid;
    Client: {
        id  : uuid;
        Name: string;
        Code: string;
    };
    Name        : string;
    Description : string;
    ImageUrl    : string;
    Participants: {
        id         : string;
        FirstName  : string;
        LastName   : string;
        CountryCode: string;
        Phone      : string;
        Email      : string;
        ImageUrl   : string;
    }[];
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface ParticipantGroupSearchFilters extends BaseSearchFilters {
    ClientId?      : uuid;
    ReferenceId?   : uuid;
    Name?          : string;
    ParticipantId? : uuid;
}

export interface ParticipantGroupSearchResults extends BaseSearchResults {
    Items: ParticipantGroupResponseDto[];
}
