import { Schema } from '../../models/engine/schema.model';
import {
    SchemaResponseDto
} from '../../../domain.types/engine/schema.domain.types';
import { IncomingEventType } from '../../models/engine/incoming.event.type.model';

///////////////////////////////////////////////////////////////////////////////////

export class SchemaMapper {

    static toResponseDto = (schema: Schema, eventTypes?: IncomingEventType[]): SchemaResponseDto => {
        if (schema == null) {
            return null;
        }
        const dto: SchemaResponseDto = {
            id     : schema.id,
            Type   : schema.Type,
            Client : schema.Client ? {
                id   : schema.Client.id,
                Name : schema.Client.Name,
                Code : schema.Client.Code,
            }: null,
            Name        : schema.Name,
            Description : schema.Description,
            ValidFrom   : schema.ValidFrom,
            ValidTill   : schema.ValidTill,
            IsValid     : schema.IsValid,
            RootNodeId  : schema.RootNodeId,
            EventTypes  : eventTypes? eventTypes.map(x => {
                return {
                    id         : x.id,
                    Name       : x.Name,
                    Description: x.Description,
                };
            }): [],
            CreatedAt   : schema.CreatedAt,
            UpdatedAt   : schema.UpdatedAt,
        };
        return dto;
    };

}
