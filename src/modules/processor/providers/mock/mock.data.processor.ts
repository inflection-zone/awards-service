import { ContinuityInputParams, LogicalOperator, OutputParams } from "../../../../domain.types/engine/engine.types";
import { IDataProcessor } from "../../interfaces/data.processor.interface";
import { OperandDataType } from "../../../../domain.types/engine/engine.types";
import { TypeUtils } from "../../../../common/utilities/type.utils";
import { ProcessorResult } from "../../../../domain.types/engine/engine.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";

//////////////////////////////////////////////////////////////////////

export class MockDataProcessorr implements IDataProcessor {

    calculateContinuity = async (
        records: any[], 
        inputParams: ContinuityInputParams, 
        outputParams: OutputParams): Promise<ProcessorResult> => {
        throw new Error("Method not implemented.");    
    };
    
    //#region Private methods

    // getConsecutiveOccurrences = (records: any[], predicate, numOccurrences: number) => {
    //     let count = 0;
    //     const foundBundles = [];
    //     var bundle = [];
    //     for (let i = 0; i < records.length; i++) {
    //         if (predicate(records[i])) {
    //             count++;
    //             bundle.push(records[i]);
    //             if (count === numOccurrences) {
    //                 foundBundles.push(bundle);
    //                 count = 0;
    //                 bundle = [];
    //             }
    //         } else {
    //             count = 0;
    //             bundle = [];
    //         }
    //     }
    //     return foundBundles;
    // }

    //#endregion

}
