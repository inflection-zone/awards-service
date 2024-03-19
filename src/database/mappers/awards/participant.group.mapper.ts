import { ParticipantGroup } from '../../models/awards/participant.group.model';
import {
    ParticipantGroupResponseDto
} from '../../../domain.types/awards/participant.group.domain.types';
import { ClientMapper } from '../client/client.mapper';

///////////////////////////////////////////////////////////////////////////////////

export class ParticipantGroupMapper {

    static toResponseDto = (group: ParticipantGroup): ParticipantGroupResponseDto => {
        if (group == null) {
            return null;
        }
        const client = ClientMapper.toResponseDto(group.Client);
        const dto: ParticipantGroupResponseDto = {
            id          : group.id,
            ReferenceId : group.ReferenceId,
            Client      : client,
            Name        : group.Name,
            Description : group.Description,
            ImageUrl    : group.ImageUrl,
            Participants: group.Participants.map(x => { return {
                id         : x.id,
                FirstName  : x.FirstName,
                LastName   : x.LastName,
                CountryCode: x.CountryCode,
                Phone      : x.Phone,
                Email      : x.Email,
                ImageUrl   : x.ProfileImageUrl
            };
        }),
            CreatedAt: group.CreatedAt,
            UpdatedAt: group.UpdatedAt,
        };
        return dto;
    };

}
