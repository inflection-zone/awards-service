import { ProcessorResult } from '../../../domain.types/engine/engine.enums';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

export interface IDataComparator {

    compareRange(contextId: uuid, subject: any): Promise<ProcessorResult>;

}
