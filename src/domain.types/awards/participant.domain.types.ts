import {
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";
import { PersonModel, PersonResponseDto, PersonSearchFilters } from '../person.domain.types';

//////////////////////////////////////////////////////////////

export interface ParticipantCreateModel extends PersonModel {
    ClientId       ?: uuid;
    OnboardingDate ?: Date;
}

export interface ParticipantUpdateModel extends PersonModel {
    id              : uuid;
    ClientId       ?: uuid;
    OnboardingDate ?: Date;
}

export interface ParticipantResponseDto extends PersonResponseDto {
    Client        : {
        id  : uuid;
        Name: string;
        Code: string;
    };
    OnboardingDate: Date;
}

export interface ParticipantSearchFilters extends PersonSearchFilters {
    ClientId ? : uuid;
}

export interface ParticipantSearchResults extends BaseSearchResults {
    Items: ParticipantResponseDto[];
}
