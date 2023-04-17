import { Rule } from '../../models/engine/rule.model';
import {
    RuleResponseDto
} from '../../../domain.types/engine/rule.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class RuleMapper {

    static toResponseDto = (rule: Rule): RuleResponseDto => {
        if (rule == null) {
            return null;
        }
        const dto: RuleResponseDto = {
            id          : rule.id,
            Name        : rule.Name,
            Description : rule.Description,
            ParentNode : rule.ParentNode ? {
                id          : rule.ParentNode.id,
                Name        : rule.ParentNode.Name,
                Description : rule.ParentNode.Description,
            }          : null,
            Condition : {
                id          : rule.Condition.id,
                Name        : rule.Condition.Name,
                Operator    : rule.Condition.Operator,
            },
            Action : rule.Action ? {
                id          : rule.Action.id,
                Name        : rule.Action.Name,
                Description : rule.Action.Description,
                ActionType  : rule.Action.ActionType,
                InputParams : rule.Action.InputParams,
                OutputParams: rule.Action.OutputParams,
            }           : null,
            CreatedAt : rule.CreatedAt,
            UpdatedAt : rule.UpdatedAt,
        };
        return dto;
    };

}
