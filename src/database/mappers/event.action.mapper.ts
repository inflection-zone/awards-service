import {
    EventActionDto
} from '../../domain.types/event.action.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class EventActionMapper {

    static toDto = (eventAction: any): EventActionDto => {
        if (eventAction == null) {
            return null;
        }
        const dto: EventActionDto = {
            id: eventAction.id,
            EventActionTypeId: eventAction.EventActionTypeId,
            ParticipantId: eventAction.ParticipantId,
            SchemeId: eventAction.SchemeId,
            Timestamp: eventAction.Timestamp,
            RootRuleNodeId: eventAction.RootRuleNodeId,

        };
        return dto;
    };

}