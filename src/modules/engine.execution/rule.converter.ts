import { CompositionOperator, LogicalOperator, OperatorType } from '../../domain.types/engine/engine.types';
import {
    CCondition,
    CRule } from './execution.types';

export class RuleConverter {

    public static convertRule = (rule: CRule) =>{

        var condition = rule.RootCondition as CCondition;

        var decision: any = {
            conditions : RuleConverter.addCompositeCondition(condition),
            event      : {
                type   : rule.Action?.ActionType,
                params : rule.Action?.OutputParams
            }
        };

        return decision;
    };

    private static addCompositeCondition(condition: CCondition) {
        if (condition.OperatorType !== OperatorType.Composition) {
            throw new Error('Expecting a composite condition!');
        }
        var list = RuleConverter.addChildrenConditions(condition);
        if (condition.Operator == CompositionOperator.And) {
            return {
                all : list
            };
        }
        else {
            return {
                any : list
            };
        }
    }

    private static addChildrenConditions(condition: CCondition) {
        var list: any = [];
        for (var child of condition.Children) {
            if (child.OperatorType === OperatorType.Composition) {
                const x = RuleConverter.addCompositeCondition(child);
                list.push(x);
            }
            else {
                const x = RuleConverter.addLogicalCondition(child);
                list.push(x);
            }
        }
        return list;
    }

    private static addLogicalCondition(condition: CCondition) {
        if (condition.OperatorType === OperatorType.Composition) {
            throw new Error('Not expecting a composite condition!');
        }
        var operator = RuleConverter.translateLogicalOperator(condition.Operator as LogicalOperator);
        return {
            fact     : condition.Fact,
            operator : operator,
            value    : condition.Value
        };
    }

    private static translateLogicalOperator(operator: LogicalOperator) {
        switch (operator) {
            case LogicalOperator.Equal:
            {
                return 'equal';
            }
            case LogicalOperator.NotEqual:
            {
                return 'notEqual';
            }
            case LogicalOperator.LessThan:
            {
                return 'lessThan';
            }
            case LogicalOperator.LessThanOrEqual:
            {
                return 'lessThanInclusive';
            }
            case LogicalOperator.GreaterThan:
            {
                return 'greaterThan';
            }
            case LogicalOperator.GreaterThanOrEqual:
            {
                return 'greaterThanInclusive';
            }
            case LogicalOperator.In:
            {
                return 'in';
            }
            case LogicalOperator.NotIn:
            {
                return 'notIn';
            }
            case LogicalOperator.Contains:
            {
                return 'contains';
            }
            case LogicalOperator.DoesNotContain:
            {
                return 'doesNotContain';
            }
            default: {
                return 'equal';
            }
        }
    }

}
