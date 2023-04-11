import { SchemaInstance } from '../../models/engine/schema.instance.model';
import {
    SchemaInstanceResponseDto
} from '../../../domain.types/engine/schema.instance.types';
import { IncomingEventType } from '../../models/engine/incoming.event.type.model';

///////////////////////////////////////////////////////////////////////////////////

export class SchemaInstanceMapper {

    static toResponseDto = (instance: SchemaInstance, eventTypes?: IncomingEventType[]): SchemaInstanceResponseDto => {
        if (instance == null) {
            return null;
        }
        const dto: SchemaInstanceResponseDto = {
            id     : instance.id,
            Schema : {
                id          : instance.Schema.id,
                Name        : instance.Schema.Name,
                Description : instance.Schema.Description,
                Client      : instance.Schema.Client ? {
                    id   : instance.Schema.Client.id,
                    Name : instance.Schema.Client.Name,
                } : null,
                EventTypes : eventTypes? eventTypes.map(x => {
                    return {
                        id: x.id,
                        Name: x.Name,
                        Description: x.Description
                    }
                }): [],
            },
            Context : {
                id          : instance.Context.id,
                ReferenceId : instance.Context.ReferenceId,
                Type        : instance.Context.Type,
                Participant : instance.Context.Participant ? {
                    id          : instance.Context.Participant.id,
                    ReferenceId : instance.Context.Participant.ReferenceId,
                    Prefix      : instance.Context.Participant.Prefix,
                    FirstName   : instance.Context.Participant.FirstName,
                    LastName    : instance.Context.Participant.LastName,
                } : null,
                ParticipantGroup : instance.Context.Group ? {
                    id          : instance.Context.Group.id,
                    Name        : instance.Context.Group.Name,
                    Description : instance.Context.Group.Description,
                } : null,
            },
            RootNodeInstance : instance.RootNodeInstance ? {
                id   : instance.RootNodeInstance.id,
                Node : instance.RootNodeInstance.Node ? {
                    id   : instance.RootNodeInstance.Node.id,
                    Name : instance.RootNodeInstance.Node.Name,
                } : null,
            } : null,
            CurrentNodeInstance : instance.CurrentNodeInstance ? {
                id   : instance.CurrentNodeInstance.id,
                Node : instance.CurrentNodeInstance.Node ? {
                    id   : instance.CurrentNodeInstance.Node.id,
                    Name : instance.CurrentNodeInstance.Node.Name,
                } : null,
            } : null,
            NodeInstances : instance.NodeInstances ? instance.NodeInstances.map(x => {
                return {
                    id   : x.id,
                    Node : x.Node ? {
                        id   : x.Node.id,
                        Name : x.Node.Name,
                    }: null
                };
            }) : [],
            CreatedAt : instance.CreatedAt,
            UpdatedAt : instance.UpdatedAt,
        };
        return dto;
    };

}
