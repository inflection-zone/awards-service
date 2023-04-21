import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { DataStorageInputParams, OutputParams, ProcessorResult } from '../../../domain.types/engine/engine.types';

export interface IDataStore {

    storeData(
        contextId: uuid, 
        records:any[], 
        inputParams: DataStorageInputParams, 
        outputParams: OutputParams): Promise<ProcessorResult>;

    removeData(
        contextId: uuid, 
        records:any[], 
        inputParams: DataStorageInputParams, 
        outputParams: OutputParams): Promise<ProcessorResult>;
    
}
