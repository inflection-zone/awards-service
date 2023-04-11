import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ProcessorResult } from '../../../domain.types/engine/engine.enums';

export interface IDataProcessor {

    calculateContinuity(contextId: uuid, records: any[], subject: any): Promise<ProcessorResult>;

}
