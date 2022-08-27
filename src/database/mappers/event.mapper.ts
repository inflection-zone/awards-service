import {
    EventDto
} from '../../domain.types/event.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class EventMapper {

    static toDto = (event: any): EventDto => {
        if (event == null) {
            return null;
        }
        const dto: EventDto = {
            id: event.id,
            EventTypeId: event.EventTypeId,
            ParticipantId: event.ParticipantId,
            SchemeId: event.SchemeId,
            Timestamp: event.Timestamp,
            RootRuleNodeId: event.RootRuleNodeId,

        };
        return dto;
    };

}