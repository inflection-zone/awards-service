import { SchemaInstance } from '../../models/engine/schema.instance.model';
import {
    SchemaInstanceResponseDto
} from '../../../domain.types/engine/schema.instance.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class SchemaInstanceMapper {

    static toResponseDto = (instance: SchemaInstance): SchemaInstanceResponseDto => {
        if (instance == null) {
            return null;
        }
        const dto: SchemaInstanceResponseDto = {
            id     : instance.id,
            Schema : {
                id          : instance.Schema.id,
                Name        : instance.Schema.Name,
                Description : instance.Schema.Description,
                Client      : {
                    id   : instance.Schema.Client.id,
                    Name : instance.Schema.Client.Name,
                }
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
                Node : {
                    id   : instance.RootNodeInstance.Node.id,
                    Name : instance.RootNodeInstance.Node.Name,
                }
            } : null,
            CurrentNodeInstance : instance.CurrentNodeInstance ? {
                id   : instance.CurrentNodeInstance.id,
                Node : {
                    id   : instance.CurrentNodeInstance.Node.id,
                    Name : instance.CurrentNodeInstance.Node.Name,
                }
            } : null,
            NodeInstances : instance.NodeInstances.map(x => {
                return {
                    id   : x.id,
                    Node : {
                        id   : x.Node.id,
                        Name : x.Node.Name,
                    }
                };
            }),
            CreatedAt : instance.CreatedAt,
            UpdatedAt : instance.UpdatedAt,
        };
        return dto;
    };

}
