import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { IDataComparator } from "../../interfaces/data.comparator.interface";
import { ProcessorResult } from '../../../../domain.types/engine/engine.enums';

//////////////////////////////////////////////////////////////////////

export class DataComparator implements IDataComparator {

    compareRange = async (contextId: uuid, subject: any): Promise<ProcessorResult> => {
        throw new Error("Method not implemented.");
    };
    
}
