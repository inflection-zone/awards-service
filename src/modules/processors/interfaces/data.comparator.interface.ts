import { uuid } from '../../../domain.types/miscellaneous/system.types';

export interface IDataComparator {

    compareRange(contextId: uuid, subject: any): Promise<any[]>;

}
