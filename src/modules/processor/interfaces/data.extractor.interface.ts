import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ProcessorResult } from '../../../domain.types/engine/engine.types';

export interface IDataExtractor {

    extractData(contextId: uuid, subject: any): Promise<ProcessorResult>;

}
