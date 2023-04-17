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
                Type         : instance.Node.Type,
                Name         : instance.Node.Name,
                Action: instance.Node.Action ? {
                    id        : instance.Node.Action.id,
                    Name      : instance.Node.Action.Name,
                    ActionType: instance.Node.Action.ActionType,
                    InputParams: instance.Node.Action.InputParams,
                    OutputParams    : instance.Node.Action.OutputParams,
                } : null,
                Rules: instance.Node.Rules? instance.Node.Rules.map(x => {
                    return {
                        id: x.id,
                        Name: x.Name,
                        Action : {
                            id          : x.Action.id,
                            Name        : x.Action.Name,
                            ActionType  : x.Action.ActionType,
                            InputParams : x.Action.InputParams,
                            OutputParams: x.Action.OutputParams,
                        },
                        Condition : {
                            id: x.Condition.id,
                            Name: x.Condition.Name,
                            Operator: x.Condition.Operator,
                            DataType: x.Condition.DataType,
                            Fact: x.Condition.Fact,
                        }
                    }
                }): [],
            },
            SchemaInstance : {
                id    : instance.SchemaInstance.id,
                Schema: instance.SchemaInstance.Schema ? {
                    id         : instance.SchemaInstance.Schema.id,
                    Name       : instance.SchemaInstance.Schema.Name,
                    Description: instance.SchemaInstance.Schema.Description,
                } : null
            },
            Context : instance.SchemaInstance.Context ? {
                id : instance.SchemaInstance.Context.id,
                ReferenceId: instance.SchemaInstance.Context.ReferenceId,
                Type : instance.SchemaInstance.Context.Type,
            } : null,
            ParentNodeInstance : instance.ParentNodeInstance ? {
                id         : instance.ParentNodeInstance.id,
                Node : instance.ParentNodeInstance.Node ? {
                    id: instance.ParentNodeInstance.Node.id,
                    Name: instance.ParentNodeInstance.Node.Name,
                } : null
            } : null,
            ChildrenNodeInstances : instance.ChildrenNodeInstances ? instance.ChildrenNodeInstances.map(x => {
                return {
                    id : x.id,
                    Node : x.Node ? {
                        id: x.Node.id,
                        Name: x.Node.Name,
                    } : null
                };
            }) : [],
            CreatedAt: instance.CreatedAt,
            UpdatedAt: instance.UpdatedAt,
        };
        return dto;
    };

}
