import { OutputParams, ProcessorResult, RangeComparisonInputParams } from '../../../domain.types/engine/engine.types';
import { uuid } from '../../../domain.types/miscellaneous/system.types';

export interface IDataComparator {

    compareRanges(
        firstRange: any[],
        secondRange: any[],
        inputParams: RangeComparisonInputParams,
        outputParams: OutputParams
    ): Promise<ProcessorResult>;

}
