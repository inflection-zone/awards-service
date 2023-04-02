import { NodeInstance } from '../../models/engine/node.instance.model';
import {
    NodeInstanceResponseDto
} from '../../../domain.types/engine/node.instance.types';

///////////////////////////////////////////////////////////////////////////////////

export class NodeInstanceMapper {

    static toResponseDto = (instance: NodeInstance): NodeInstanceResponseDto => {
        if (instance == null) {
            return null;
        }
        const dto: NodeInstanceResponseDto = {
            id                   : instance.id,
            ExecutionStatus      : instance.ExecutionStatus,
            StatusUpdateTimestamp: instance.StatusUpdateTimestamp,
            ApplicableRule : instance.ApplicableRule ? {
                id         : instance.ApplicableRule.id,
                Name       : instance.ApplicableRule.Name,
                Description: instance.ApplicableRule.Description,
            } : null,
            AvailableFacts       : instance.AvailableFacts ?? [],
            ExecutedDefaultAction: instance.ExecutedDefaultAction,
            ExecutionResult      : instance.ExecutionResult ?? null,
            Node: {
                id           : instance.Node.id,
                Name         : instance.Node.Name,
                DefaultAction: instance.Node.DefaultAction ? {
                    id        : instance.Node.DefaultAction.id,
                    Name      : instance.Node.DefaultAction.Name,
                    ActionType: instance.Node.DefaultAction.ActionType,
                    Params    : instance.Node.DefaultAction.Params,
                } : null,
                Rules: instance.Node.Rules.map(x => {
                    return {
                        id: x.id,
                        Name: x.Name,
                        Action : {
                            id        : x.Action.id,
                            Name      : x.Action.Name,
                            ActionType: x.Action.ActionType,
                            Params : x.Action.Params,
                        },
                        Condition : {
                            id: x.Condition.id,
                            Name: x.Condition.Name,
                            Operator: x.Condition.Operator,
                            DataType: x.Condition.DataType,
                            Fact: x.Condition.Fact,
                        }
                    }
                }),
            },
            SchemaInstance : {
                id    : instance.SchemaInstance.id,
                Schema: {
                    id         : instance.SchemaInstance.Schema.id,
                    Name       : instance.SchemaInstance.Schema.id,
                    Description: instance.SchemaInstance.Schema.id,
                }
            },
            Context : {
                id : instance.SchemaInstance.Context.id,
                ReferenceId: instance.SchemaInstance.Context.ReferenceId,
                Type : instance.SchemaInstance.Context.Type,
            },
            ParentNodeInstance : {
                id         : instance.ParentNodeInstance.id,
                Node : {
                    id: instance.ParentNodeInstance.Node.id,
                    Name: instance.ParentNodeInstance.Node.Name,
                }
            },
            ChildrenNodeInstances : instance.ChildrenNodeInstances.map(x => {
                return {
                    id         : x.id,
                    Node : {
                        id: x.Node.id,
                        Name: x.Node.Name,
                    }
                };
            }),
            CreatedAt: instance.CreatedAt,
            UpdatedAt: instance.UpdatedAt,
        };
        return dto;
    };

}