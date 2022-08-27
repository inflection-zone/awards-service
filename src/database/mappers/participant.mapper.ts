import {
    ParticipantDto
} from '../../domain.types/participant.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class ParticipantMapper {

    static toDto = (participant: any): ParticipantDto => {
        if (participant == null) {
            return null;
        }
        const dto: ParticipantDto = {
            id: participant.id,
            ClientId: participant.ClientId,
            FirstName: participant.FirstName,
            LastName: participant.LastName,
            Phone: participant.Phone,
            Email: participant.Email,
            Gender: participant.Gender,
            BirthDate: participant.BirthDate,

        };
        return dto;
    };

}