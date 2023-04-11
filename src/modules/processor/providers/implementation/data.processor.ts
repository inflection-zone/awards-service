import { LogicalOperator } from "../../../../domain.types/engine/engine.enums";
import { IDataProcessor } from "../../interfaces/data.processor.interface";
import { OperandDataType } from "../../../../domain.types/engine/engine.enums";
import { TypeUtils } from "../../../../common/utilities/type.utils";

//////////////////////////////////////////////////////////////////////

export class DataProcessorr implements IDataProcessor {

    calculateContinuity = async (records: any[], subject: any): Promise<any[]> => {
        const recordType = subject.RecordType;
        const operator = subject.Operator as LogicalOperator;
        const dataType = subject.DataType as OperandDataType;
        const numOccurrences = subject.ContinuityCount;
        const operandValue = subject.OperandValue;
        const secondOperandValue = subject.SecondOperandValue;
        const valueName = subject.ValueName;

        const predicate = (x) => {
            let v;
            //check where x is an object or itself an perand to process through predicate
            if(valueName && TypeUtils.isObject(x)) {
                v = x[valueName];
            }
            else {
                v = x;
            }
            if (!v) {
                return false;
            }
            if (operator === LogicalOperator.Equal) {
                if (operandValue) {
                    return v === operandValue;
                }
            }
            else if (operator === LogicalOperator.NotEqual) {
                if (operandValue) {
                    return v != operandValue;
                }
            }
            else if (operator === LogicalOperator.Exists) {
                return v !== undefined && v !== null;
            }
            else if (operator === LogicalOperator.IsFalse) {
                return v === false;
            }
            else if (operator === LogicalOperator.IsTrue) {
                return v === true;
            }
            else if (operator === LogicalOperator.GreaterThan) {
                if (operandValue) {
                    return v > operandValue;
                }
            }
            else if (operator === LogicalOperator.GreaterThanOrEqual) {
                if (operandValue) {
                    return v >= operandValue;
                }
            }
            else if (operator === LogicalOperator.LessThan) {
                if (operandValue) {
                    return v < operandValue;
                }
            }
            else if (operator === LogicalOperator.LessThanOrEqual) {
                if (operandValue) {
                    return v <= operandValue;
                }
            }
            else if (operator === LogicalOperator.Between) {
                if (operandValue && secondOperandValue) {
                    return v <= operandValue && v >= secondOperandValue;
                }
            }
            else if (operator === LogicalOperator.Contains) {
                if (operandValue && Array.isArray(v)) {
                    return v.includes(operandValue);
                }
            }
            else if (operator === LogicalOperator.DoesNotContain) {
                if (operandValue && Array.isArray(v)) {
                    return !v.includes(operandValue);
                }
            }
            else if (operator === LogicalOperator.In) {
                if (operandValue && Array.isArray(operandValue)) {
                    return operandValue.includes(v);
                }
            }
            else if (operator === LogicalOperator.NotIn) {
                if (operandValue && Array.isArray(operandValue)) {
                    return !operandValue.includes(v);
                }
            }
            return false;
        }

        const bundles = this.getConsecutiveOccurrences(records, predicate, numOccurrences);
        return bundles;
    };
    
    //#region Private methods

    getConsecutiveOccurrences = (records: any[], predicate, numOccurrences: number) => {
        let count = 0;
        const foundBundles = [];
        var bundle = [];
        for (let i = 0; i < records.length; i++) {
            if (predicate(records[i])) {
                count++;
                bundle.push(records[i]);
                if (count === numOccurrences) {
                    foundBundles.push(bundle);
                    count = 0;
                    bundle = [];
                }
            } else {
                count = 0;
                bundle = [];
            }
        }
        return foundBundles;
    }

    //#endregion

}
