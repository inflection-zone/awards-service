import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { IDataStore } from "../../interfaces/data.store.interface";
import { DataStorageInputParams, OutputParams, ProcessorResult } from "../../../../domain.types/engine/engine.types";

//////////////////////////////////////////////////////////////////////

export class MockDataStore implements IDataStore {

    storeData = async (
        contextId: uuid, 
        records:any[], 
        inputParams: DataStorageInputParams, 
        outputParams: OutputParams): Promise<ProcessorResult> => {
        throw new Error("Method not implemented.");
    };

    removeData = async (
        contextId: uuid, 
        records:any[], 
        inputParams: DataStorageInputParams, 
        outputParams: OutputParams): Promise<ProcessorResult> => {
        throw new Error("Method not implemented.");
    };

}
