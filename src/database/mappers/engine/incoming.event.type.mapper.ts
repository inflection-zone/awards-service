import { IncomingEventTypeResponseDto } from '../../../domain.types/engine/incoming.event.type.types';
import { IncomingEventType } from '../../models/engine/incoming.event.type.model';

///////////////////////////////////////////////////////////////////////////////////

export class IncomingEventTypeMapper {

    static toResponseDto = (type: IncomingEventType)
        : IncomingEventTypeResponseDto => {
        if (type == null) {
            return null;
        }
        const dto: IncomingEventTypeResponseDto = {
            id          : type.id,
            Name        : type.Name,
            Description : type.Description,
        };
        return dto;
    };

}
