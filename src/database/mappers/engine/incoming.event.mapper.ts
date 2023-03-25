import { IncomingEvent } from "../../models/engine/incoming.event.model";
import { IncomingEventResponseDto } from "../../../domain.types/engine/incoming.event.types";

///////////////////////////////////////////////////////////////////////////////////

export class IncomingEventMapper {

    static toResponseDto = (event: IncomingEvent): IncomingEventResponseDto => {
        if (event == null) {
            return null;
        }
        const dto: IncomingEventResponseDto = {
            id          : event.id,
            ReferenceId : event.ReferenceId,
            EventType   : {
                id          : event.EventType.id,
                Name        : event.EventType.Name,
                Description : event.EventType.Description,
            },
            Context : {
                id          : event.Context.id,
                ReferenceId : event.Context.ReferenceId,
                Type        : event.Context.Type,
                Participant : event.Context.Participant ? {
                    id          : event.Context.Participant.id,
                    ReferenceId : event.Context.Participant.ReferenceId,
                    Prefix      : event.Context.Participant.Prefix,
                    FirstName   : event.Context.Participant.FirstName,
                    LastName    : event.Context.Participant.LastName,
                } : null,
                ParticipantGroup : event.Context.Group ? {
                    id          : event.Context.Group.id,
                    Name        : event.Context.Group.Name,
                    Description : event.Context.Group.Description,
                } : null,
            },
            Payload   : event.Payload,
            CreatedAt : event.CreatedAt,
            UpdatedAt : event.UpdatedAt,
        };
        return dto;
    };

}
