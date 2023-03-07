import {
    ParticipantResponseDto
} from '../../domain.types/participant.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class ParticipantMapper {

    static toDto = (participant: any): ParticipantResponseDto => {
        if (participant == null) {
            return null;
        }
        const dto: ParticipantResponseDto = {
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