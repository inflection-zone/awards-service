import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { DataExtractionInputParams, OutputParams, ProcessorResult } from '../../../domain.types/engine/engine.types';

export interface IDataExtractor {

    extractData(
        contextId: uuid, 
        inputParams: DataExtractionInputParams, 
        outputParams: OutputParams): Promise<ProcessorResult>;

}
