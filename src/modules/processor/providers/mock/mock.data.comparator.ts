import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { IDataComparator } from "../../interfaces/data.comparator.interface";

//////////////////////////////////////////////////////////////////////

export class MockDataComparator implements IDataComparator {

    compareRange = async (contextId: uuid, subject: any): Promise<any[]> => {
        throw new Error("Method not implemented.");
    };
    
}
