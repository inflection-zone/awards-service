import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { ContinuityInputParams, OutputParams, ProcessorResult } from '../../../domain.types/engine/engine.types';

export interface IDataProcessor {

    calculateContinuity(
        records: any[], 
        inputParams: ContinuityInputParams, 
        outputParams: OutputParams): Promise<ProcessorResult>;

}
