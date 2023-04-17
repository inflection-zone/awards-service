import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ProcessorResult } from '../../../domain.types/engine/engine.types';

export interface IDataStore {

    storeData(contextId: uuid, subject: any, records:any[]): Promise<ProcessorResult>;

}
