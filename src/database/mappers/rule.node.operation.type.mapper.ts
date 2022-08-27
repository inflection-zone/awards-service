import {
    RuleNodeOperationTypeDto
} from '../../domain.types/rule.node.operation.type.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class RuleNodeOperationTypeMapper {

    static toDto = (ruleNodeOperationType: any): RuleNodeOperationTypeDto => {
        if (ruleNodeOperationType == null) {
            return null;
        }
        const dto: RuleNodeOperationTypeDto = {
            Composition: ruleNodeOperationType.Composition,
            Logical: ruleNodeOperationType.Logical,
            Mathematical: ruleNodeOperationType.Mathematical,

        };
        return dto;
    };

}