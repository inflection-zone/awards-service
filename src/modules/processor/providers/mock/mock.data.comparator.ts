import { ProcessorResult } from "../../../../domain.types/engine/engine.enums";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { IDataComparator } from "../../interfaces/data.comparator.interface";

//////////////////////////////////////////////////////////////////////

export class MockDataComparator implements IDataComparator {

    compareRanges = async (contextId: uuid, subject: any): Promise<ProcessorResult> => {
        throw new Error("Method not implemented.");
    };
    
}
