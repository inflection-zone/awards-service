import { uuid } from '../../../domain.types/miscellaneous/system.types';

export interface IDataProcessor {

    calculateContinuity(records: any[], subject: any): Promise<any[]>;

}
