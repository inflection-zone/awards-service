import { Context } from "../../models/engine/context.model";
import { ContextResponseDto } from "../../../domain.types/engine/context.types";

///////////////////////////////////////////////////////////////////////////////////

export class ContextMapper {

    static toResponseDto = (context: Context): ContextResponseDto => {
        if (context == null) {
            return null;
        }
        const dto: ContextResponseDto = {
                id          : context.id,
                ReferenceId : context.ReferenceId,
                Type        : context.Type,
                Participant : context.Participant ? {
                    id          : context.Participant.id,
                    ReferenceId : context.Participant.ReferenceId,
                    Prefix      : context.Participant.Prefix,
                    FirstName   : context.Participant.FirstName,
                    LastName    : context.Participant.LastName,
                } : null,
                ParticipantGroup : context.Group ? {
                    id          : context.Group.id,
                    Name        : context.Group.Name,
                    Description : context.Group.Description,
                } : null,
            CreatedAt : context.CreatedAt,
            UpdatedAt : context.UpdatedAt,
        };
        return dto;
    };

}
