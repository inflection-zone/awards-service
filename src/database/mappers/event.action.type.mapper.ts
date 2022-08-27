import {
    EventActionTypeDto
} from '../../domain.types/event.action.type.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class EventActionTypeMapper {

    static toDto = (eventActionType: any): EventActionTypeDto => {
        if (eventActionType == null) {
            return null;
        }
        const dto: EventActionTypeDto = {
            id: eventActionType.id,
            SchemeId: eventActionType.SchemeId,
            EventId: eventActionType.EventId,
            ClientId: eventActionType.ClientId,
            Name: eventActionType.Name,
            RootRuleNodeId: eventActionType.RootRuleNodeId,

        };
        return dto;
    };

}