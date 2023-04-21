import { OutputParams, ProcessorResult, RangeComparisonInputParams } from "../../../../domain.types/engine/engine.types";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { IDataComparator } from "../../interfaces/data.comparator.interface";

//////////////////////////////////////////////////////////////////////

export class MockDataComparator implements IDataComparator {

    compareRanges = async (
        firstRange: any[],
        secondRange: any[],
        inputParams: RangeComparisonInputParams,
        outputParams: OutputParams): Promise<ProcessorResult> => {
        throw new Error("Method not implemented.");
    };
    
}
