import { ContextType } from "../engine/engine.types";
import {
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";
import { PersonModel, PersonResponseDto, PersonSearchFilters } from '../user/person.domain.types';

//////////////////////////////////////////////////////////////

export interface ParticipantCreateModel extends PersonModel {
    ClientId       ?: uuid;
    OnboardingDate ?: Date;
}

export interface ParticipantUpdateModel extends PersonModel {
    ClientId       ?: uuid;
    OnboardingDate ?: Date;
}

export interface ParticipantResponseDto extends PersonResponseDto {
    Client ?: {
        id  : uuid;
        Name: string;
        Code: string;
    };
    Context ?: {
        id  : uuid;
        Type: ContextType;
    };
    OnboardingDate: Date;
}

export interface ParticipantSearchFilters extends PersonSearchFilters {
    ClientId ? : uuid;
}

export interface ParticipantSearchResults extends BaseSearchResults {
    Items: ParticipantResponseDto[];
}

export interface ParticipantBadgeResponseDto {
    ParticipantId: uuid;
    Badge : {
        id         : uuid;
        Name       : string;
        Description: string;
        Category   : {
            id      : uuid;
            Name    : string;
            ImageUrl: string;
        };
        ImageUrl: string;
    };
    AcquiredDate: Date;
    Reason      : string;
    CreatedAt : Date;
}
