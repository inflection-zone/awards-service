import { Participant } from '../../models/awards/participant.model';
import {
    ParticipantResponseDto
} from '../../../domain.types/awards/participant.domain.types';
import { ClientMapper } from '../client/client.mapper';
import { ParticipantBadge } from '../../models/awards/participant.badge.model';
import { Context } from '../../models/engine/context.model';
import { Client } from '../../models/client/client.model';

///////////////////////////////////////////////////////////////////////////////////

export class ParticipantMapper {

    static toResponseDto = (participant: Participant, context?: Context): ParticipantResponseDto => {
        if (participant == null) {
            return null;
        }
        const client = ClientMapper.toResponseDto(participant.Client);
        const dto: ParticipantResponseDto = {
            id              : participant.id,
            ReferenceId     : participant.ReferenceId,
            Context         : context,
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
