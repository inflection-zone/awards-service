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
            DefaultAction : node.DefaultAction ? {
                id          : node.DefaultAction.id,
                Name        : node.DefaultAction.Name,
                Description : node.DefaultAction.Description,
                ActionType  : node.DefaultAction.ActionType,
                Params      : node.DefaultAction.Params ? {
                    Action     : node.DefaultAction.Params.Action,
                    Message    : node.DefaultAction.Params.Message,
                    NextNodeId : node.DefaultAction.Params.NextNodeId,
                    Extra      : node.DefaultAction.Params.Extra,
                } : null,
            } : null,
            CreatedAt : node.CreatedAt,
            UpdatedAt : node.UpdatedAt,
        };
        return dto;
    };

}
