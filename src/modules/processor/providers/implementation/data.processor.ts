import { LogicalOperator } from "../../../../domain.types/engine/engine.enums";
import { IDataProcessor } from "../../interfaces/data.processor.interface";
import { OperandDataType } from "../../../../domain.types/engine/engine.enums";
import { TypeUtils } from "../../../../common/utilities/type.utils";
import { ProcessorResult } from '../../../../domain.types/engine/engine.enums';
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

    calculateContinuity = async (contextId: uuid, records: any[], subject: any)
        : Promise<ProcessorResult> => {

        return new Promise((resolve, reject) => {
            try {
                const recordType = subject.RecordType;
                const operator = subject.Operator as LogicalOperator;
                const keyDataType = subject.KeyDataType as OperandDataType;
                const valueDataType = subject.DataType as OperandDataType;
                const numOccurrences = subject.ContinuityCount;
                const operandValue = subject.OperandValue;
                const secondOperandValue = subject.SecondOperandValue;
                const valueName = 'value';

                const options = {
                    keyDataType,
                    valueDataType,
                    operator,
                    operandValue,
                    secondOperandValue,
                    valueName
                };
        
                //const records_ = this.transformRecords(records, keyDataType, valueDataType);
        
                const bundles = this.getConsecutiveOccurrences(records, predicate, numOccurrences, options);
        
                const result: ProcessorResult = {
                    Success: true,
                    Tag    : [recordType, 'Continuity', numOccurrences.toString()].join(':'),
                    Data   : bundles
                };
                resolve(result);

            } catch (error) {
                reject(error);
            }
        });

    };
    
    //#region Private methods

    transformRecords = (records: any[], keyDataType: OperandDataType, valueDataType: OperandDataType): any[] => {
        const records_ = records.map(x => {
            return {

            }
        });
        return records_;
    };

    getConsecutiveOccurrences = (records: any[], predicate: PredicateType, numOccurrences: number, options: any) => {
        let count = 0;
        const foundBundles = [];
        var bundle = [];
        for (let i = 0; i < records.length; i++) {
            if (predicate(
                records[i], 
                options.valueName, 
                options.operator, 
                options.operandValue, 
                options.secondOperandValue)) {
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
