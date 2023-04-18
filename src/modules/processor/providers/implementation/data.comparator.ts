import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { IDataComparator } from "../../interfaces/data.comparator.interface";
import { 
    OutputParams, 
    ProcessorResult, 
    RangeComparisonInputParams } from '../../../../domain.types/engine/engine.types';

//////////////////////////////////////////////////////////////////////

export class DataComparator implements IDataComparator {

    compareRanges = async (    rangeToBeCompared: any[],
        referenceRange: any[],
        inputParams: RangeComparisonInputParams,
        outputParams: OutputParams)
        : Promise<ProcessorResult> => {

        return new Promise((resolve, reject) => {
            try {
                var data = {
                    ToBeAdded: rangeToBeCompared,
                    ToBeRemoved: referenceRange
                };

                if (rangeToBeCompared.length === 0 && referenceRange.length > 0) {
                    data.ToBeAdded = [];
                    data.ToBeRemoved = referenceRange;
                }
                else if (rangeToBeCompared.length > 0 && referenceRange.length === 0) {
                    data.ToBeAdded = rangeToBeCompared;
                    data.ToBeRemoved = [];
                }
                else {
                    //Need to work on this... Use badge key as (start)-(end)-(title)
                    // var toBeAdded = [];
                    // var toBeRemoved = [];
                    // for(var e of rangeToBeCompared) {
                    //     for (var r of referenceRange) {
                    //         if (e.start > r.start && e.start < r.end) {
                    //             toBeRemoved.push(r);
                    //         }
                    //     }
                    // }
                }
                const result: ProcessorResult = {
                    Success: true,
                    Tag: outputParams.OutputTag,
                    Data: data
                };
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    };

}

    // const overlap = (e: any,  referenceRange: any[]): boolean => {
    //     for (var r of referenceRange) {
    //         if (e.start > r.start && e.start < r.end) {
    //             return true;
    //         }
    //     }
    // }
