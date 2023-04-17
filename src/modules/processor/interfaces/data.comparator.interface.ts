import { ProcessorResult } from '../../../domain.types/engine/engine.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

export interface IDataComparator {

    compareRanges(subject: any, firstRange: any[], secondRange: any[]): Promise<ProcessorResult>;

}
