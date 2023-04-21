import { Node } from '../../models/engine/node.model';
import {
    NodeResponseDto
} from '../../../domain.types/engine/node.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class NodeMapper {

    static toResponseDto = (node: Node): NodeResponseDto => {
        if (node == null) {
            return null;
        }
        const dto: NodeResponseDto = {
            id          : node.id,
            Type        : node.Type,
            Name        : node.Name,
            Description : node.Description,
            Schema      : {
                id          : node.Schema.id,
                Name        : node.Schema.Name,
                Description : node.Schema.Description,
            },
            ParentNode : node.ParentNode ? {
                id          : node.ParentNode.id,
                Name        : node.ParentNode.Name,
                Description : node.ParentNode.Description,
            }          : null,
            Children : node.Children? node.Children.map(x => {
                return {
                    id          : x.id,
                    Name        : x.Name,
                    Description : x.Description,
                };
            }): [],
            Rules         : node.Rules,
            Action : node.Action ? {
                id          : node.Action.id,
                Name        : node.Action.Name,
                Description : node.Action.Description,
                ActionType  : node.Action.ActionType,
                InputParams : node.Action.InputParams,
                OutputParams: node.Action.OutputParams,
            } : null,
            CreatedAt : node.CreatedAt,
            UpdatedAt : node.UpdatedAt,
        };
        return dto;
    };

}
