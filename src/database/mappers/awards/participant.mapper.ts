import { Participant } from '../../models/awards/participant.model';
import {
    ParticipantResponseDto
} from '../../../domain.types/awards/participant.domain.types';
import { ClientMapper } from '../client/client.mapper';

///////////////////////////////////////////////////////////////////////////////////

export class ParticipantMapper {

    static toResponseDto = (participant: Participant): ParticipantResponseDto => {
        if (participant == null) {
            return null;
        }
        const client = ClientMapper.toResponseDto(participant.Client);
        const dto: ParticipantResponseDto = {
            id              : participant.id,
            ReferenceId     : participant.ReferenceId,
            Client          : client,
            Prefix          : participant.Prefix,
            FirstName       : participant.FirstName,
            LastName        : participant.LastName,
            CountryCode     : participant.CountryCode,
            Phone           : participant.Phone,
            Email           : participant.Email,
            Gender          : participant.Gender,
            BirthDate       : participant.BirthDate,
            ProfileImageUrl : participant.ProfileImageUrl,
            OnboardingDate  : participant.OnboardingDate,
            CreatedAt       : participant.CreatedAt,
            UpdatedAt       : participant.UpdatedAt,
        };
        return dto;
    };

}