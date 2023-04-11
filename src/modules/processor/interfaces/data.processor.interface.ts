import { uuid } from '../../../domain.types/miscellaneous/system.types';

export interface IDataProcessor {

    calculateContinuity(contextId: uuid, records: any[], subject: any): Promise<any[]>;

}
