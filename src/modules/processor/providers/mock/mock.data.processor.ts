import { LogicalOperator } from "../../../../domain.types/engine/engine.enums";
import { IDataProcessor } from "../../interfaces/data.processor.interface";
import { OperandDataType } from "../../../../domain.types/engine/engine.enums";
import { TypeUtils } from "../../../../common/utilities/type.utils";

//////////////////////////////////////////////////////////////////////

export class MockDataProcessorr implements IDataProcessor {

    calculateContinuity = async (records: any[], subject: any): Promise<any[]> => {
        throw new Error("Method not implemented.");    };
    
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
