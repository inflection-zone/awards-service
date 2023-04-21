import { Context } from "../../../../../database/models/engine/context.model";
import { DataExtractionInputParams, OutputParams, ProcessorResult } from '../../../../../domain.types/engine/engine.types';

export interface IExtractor {

    extract (
        context: Context,
        inputParams: DataExtractionInputParams,
        outputParams: OutputParams): Promise<ProcessorResult>;

}
