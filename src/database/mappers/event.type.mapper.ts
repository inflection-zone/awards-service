import {
    EventTypeDto
} from '../../domain.types/event.type.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class EventTypeMapper {

    static toDto = (eventType: any): EventTypeDto => {
        if (eventType == null) {
            return null;
        }
        const dto: EventTypeDto = {
            id: eventType.id,
            SchemeId: eventType.SchemeId,
            ClientId: eventType.ClientId,
            Name: eventType.Name,
            Description: eventType.Description,
            RootRuleNodeId: eventType.RootRuleNodeId,

        };
        return dto;
    };

}