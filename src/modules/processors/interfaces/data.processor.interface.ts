import { uuid } from '../../../domain.types/miscellaneous/system.types';

export interface IDataProcessor {

    calculateContinuity(contextId: uuid, subject: any): Promise<any[]>;

}
