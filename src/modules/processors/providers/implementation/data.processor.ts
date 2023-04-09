import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { IDataProcessor } from "../../interfaces/data.processor.interface";

//////////////////////////////////////////////////////////////////////

export class DataProcessorr implements IDataProcessor {

    calculateContinuity = async (contextId: uuid, subject: any): Promise<any[]> => {
        throw new Error("Method not implemented.");
    };
    
}
