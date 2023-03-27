import { CompositionOperator, LogicalOperator } from '../../domain.types/engine/engine.enums';
import {
    SCondition,
    SRule} from './execution.types';

export class SchemaConverter {

    public static convertRule = (rule: SRule) =>{

        var condition = rule.Condition as SCondition;

        var decision: any = {
            conditions: SchemaConverter.addCompositeCondition(condition),
            event: {
                type: rule.Event?.Type,
                params: rule.Event?.Params
            }
        };

        return decision;
    }

    private static addCompositeCondition(condition: SCondition) {
        if(!condition.IsComposite) {
            throw new Error('Expecting a composite condition!');
        }
        var list = SchemaConverter.addChildrenConditions(condition);
        if (condition.Operator == CompositionOperator.And) {
            return {
                all : list
            }
        }
        else {
            return {
                any : list
            }
        }
    }

    private static addChildrenConditions(condition: SCondition) {
        var list: any = [];
        for (var child of condition.Children) {
            if (child.IsComposite) {
                const x = SchemaConverter.addCompositeCondition(child);
                list.push(x);
            }
            else {
                const x = SchemaConverter.addLogicalCondition(child);
                list.push(x);
            }
        }
        return list;
    }

    private static addLogicalCondition(condition: SCondition) {
        if (condition.IsComposite) {
            throw new Error('Not expecting a composite condition!');
        }
        var operator = SchemaConverter.translateLogicalOperator(condition.Operator as LogicalOperator);
        return {
            fact: condition.Fact,
            operator: operator,
            value: condition.Value
        }
    }

    private static translateLogicalOperator(operator: LogicalOperator) {
        switch(operator) {
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
