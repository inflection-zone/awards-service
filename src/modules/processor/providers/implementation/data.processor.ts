import { ContinuityInputParams, LogicalOperator, OutputParams } from "../../../../domain.types/engine/engine.types";
import { IDataProcessor } from "../../interfaces/data.processor.interface";
import { OperandDataType } from "../../../../domain.types/engine/engine.types";
import { TypeUtils } from "../../../../common/utilities/type.utils";
import { ProcessorResult } from '../../../../domain.types/engine/engine.types';
import { uuid } from "../../../../domain.types/miscellaneous/system.types";

//////////////////////////////////////////////////////////////////////

type PredicateType = (value: any, 
    valueName: string, 
    operator: LogicalOperator, 
    operandValue: any, 
    secondOperandValue: any) => boolean;

const predicate: PredicateType = (x: any, 
    valueName: string, 
    operator: LogicalOperator, 
    operandValue: any, 
    secondOperandValue: any): boolean => {

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

//////////////////////////////////////////////////////////////////////

export class DataProcessorr implements IDataProcessor {

    calculateContinuity = async (
        records: any[], 
        inputParams: ContinuityInputParams, 
        outputParams: OutputParams)
        : Promise<ProcessorResult> => {

        return new Promise((resolve, reject) => {
            try {

                const bundles = this.getConsecutiveOccurrences(records, predicate, inputParams);
                const bundles_ = [];
                for (var b of bundles) {
                    if (b.length > 0) {
                        const start = b[0];
                        const end = b[b.length - 1];
                        const obj = {
                            start : start,
                            end   : end,
                            bundle: b
                        };
                        bundles_.push(obj);
                    }
                }
                const result: ProcessorResult = {
                    Success: true,
                    Tag    : outputParams.OutputTag,
                    Data   : bundles_
                };
                resolve(result);

            } catch (error) {
                reject(error);
            }
        });

    };
    
    //#region Private methods

    getConsecutiveOccurrences = (
        records: any[], predicate: PredicateType, options: ContinuityInputParams) => {
        let count = 0;
        const foundBundles = [];
        var bundle = [];
        const numOccurrences: number = options.ContinuityCount;
        const valueName = 'value'; // Pl. check this again...

        for (let i = 0; i < records.length; i++) {
            if (predicate(
                records[i], 
                valueName, 
                options.Operator, 
                options.Value, 
                options.SecondaryValue)) {
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
    };

    //#endregion

}
