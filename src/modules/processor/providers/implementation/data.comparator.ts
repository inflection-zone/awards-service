import { IDataComparator } from "../../interfaces/data.comparator.interface";
import {
    OutputParams,
    ProcessorResult,
    RangeComparisonInputParams,
} from '../../../../domain.types/engine/engine.types';

//////////////////////////////////////////////////////////////////////

export class DataComparator implements IDataComparator {

    compareRanges = async (incomingRange: any[],
        referenceRange: any[],
        inputParams: RangeComparisonInputParams,
        outputParams: OutputParams)
        : Promise<ProcessorResult> => {

        return new Promise((resolve, reject) => {
            try {
                var data = {
                    ToBeAdded   : incomingRange,
                    ToBeRemoved : referenceRange
                };

                if (incomingRange.length === 0 && referenceRange.length > 0) {
                    data.ToBeAdded   = [];
                    data.ToBeRemoved = referenceRange;
                }
                else if (incomingRange.length > 0 && referenceRange.length === 0) {
                    data.ToBeAdded   = incomingRange;
                    data.ToBeRemoved = [];
                }
                else {
                    var toBeAdded = [];
                    var toBeRemoved = [];
                    for (const i of incomingRange) {
                        const found = referenceRange.find(x => x.key === i.key);
                        if (!found) {
                            toBeAdded.push(i);
                        }
                    }
                    if (toBeAdded.length > 0) {
                        for (const r of referenceRange) {
                            const found = toBeAdded.find(x => x.key === r.key);
                            if (!found) {
                                toBeRemoved.push(r);
                            }
                        }
                    }
                    data.ToBeAdded   = toBeAdded;
                    data.ToBeRemoved = toBeRemoved;
                }
                const result: ProcessorResult = {
                    Success : true,
                    Tag     : outputParams.OutputTag,
                    Data    : data
                };
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    };

}

/////////////////////////////////////////////////////////////////////

//scrap

// const overlap = (e: any,  referenceRange: any[]): boolean => {
//     for (var r of referenceRange) {
//         if (e.start > r.start && e.start < r.end) {
//             return true;
//         }
//     }
// }

/////////////////////////////////////////////////////////////////////
