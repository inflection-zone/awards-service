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
            RootNode    : schema.RootNode ? {
                id         : schema.RootNode.id,
                Description: schema.RootNode.Description,
                Name       : schema.RootNode.Name,
                Type       : schema.RootNode.Type,
                Action     : schema.RootNode.Action ? {
                    Name         : schema.RootNode.Action.Name,
                    Description  : schema.RootNode.Action.Description,
                    ActionType   : schema.RootNode.Action.ActionType,
                    ActionSubject: schema.RootNode.Action.ActionSubject,
                    Params       : schema.RootNode.Action.Params ? {
                        Message   : schema.RootNode.Action.Params.Message,
                        NextNodeId: schema.RootNode.Action.Params.NextNodeId,
                        Extra     : schema.RootNode.Action.Params.Extra,
                    } : null,
                } : null,
            } : null,
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
