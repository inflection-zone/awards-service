import { Condition } from '../../models/engine/condition.model';
import {
    ConditionResponseDto
} from '../../../domain.types/engine/condition.types';

///////////////////////////////////////////////////////////////////////////////////

export class ConditionMapper {

    static toResponseDto = (condition: Condition): ConditionResponseDto => {
        if (condition == null) {
            return null;
        }
        const dto: ConditionResponseDto = {
            id                  : condition.id,
            Name                : condition.Name,
            Description         : condition.Description,
            Operator            : condition.Operator,
            DataType            : condition.DataType,
            Fact                : condition.Fact,
            Value               : condition.Value,
            LogicalOperator     : condition.LogicalOperator,
            MathematicalOperator: condition.MathematicalOperator,
            CompositionOperator : condition.CompositionOperator,
            Rule                : {
                id          : condition.Rule.id,
                Name        : condition.Rule.Name,
                Description : condition.Rule.Description,
                ParentNodeId : condition.Rule.ParentNode.id,
            },
            ParentCondition : {
                id          : condition.ParentCondition.id,
                Name        : condition.ParentCondition.Name,
                Description : condition.ParentCondition.Description,
            },
            ChildrenConditions : condition.ChildrenConditions.map(x => {
                return {
                    id          : x.id,
                    Name        : x.Name,
                    Description : x.Description,
              };
            }),
            CreatedAt : condition.CreatedAt,
            UpdatedAt : condition.UpdatedAt,
        };
        return dto;
    };

}
