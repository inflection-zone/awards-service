import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { IDataStore } from "../../interfaces/data.store.interface";
import { ProcessorResult } from "../../../../domain.types/engine/engine.types";

//////////////////////////////////////////////////////////////////////

export class MockDataStore implements IDataStore {


    storeData = async (contextId: uuid, subject: any, records: any[]): Promise<ProcessorResult> => {
        throw new Error("Method not implemented.");
    };

    //#region Private methods

    //#endregion

}
