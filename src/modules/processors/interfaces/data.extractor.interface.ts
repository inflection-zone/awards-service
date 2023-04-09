import { uuid } from '../../../domain.types/miscellaneous/system.types';

export interface IDataExtractor {

    extractData(contextId: uuid, subject: any): Promise<any[]>;

}
