import { ProcessorResult } from '../../../domain.types/engine/engine.enums';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

export interface IDataComparator {

    compareRanges(contextId: uuid, subject: any, firstRange: any[], secondRange: any[]): Promise<ProcessorResult>;

}
