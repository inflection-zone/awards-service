import {
    ContinuityInputParams,
    DataExtractionInputParams,
    DataStorageInputParams,
    RangeComparisonInputParams,
    OutputParams,
    ProcessorResult } from '../../domain.types/engine/engine.types';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { IDataComparator } from './interfaces/data.comparator.interface';
import { IDataExtractor } from './interfaces/data.extractor.interface';
import { IDataProcessor } from './interfaces/data.processor.interface';
import { IDataStore } from './interfaces/data.store.interface';
import { injectable, inject } from 'tsyringe';

///////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ProcessorService {

    constructor(
            @inject('IDataComparator') private _comparator: IDataComparator,
            @inject('IDataExtractor') private _extractor: IDataExtractor,
            @inject('IDataStore') private _store: IDataStore,
            @inject('IDataProcessor') private _processor: IDataProcessor,
    ) {
    }

    compareRanges = async (
        firstRange: any[],
        secondRange: any[],
        inputParams: RangeComparisonInputParams,
        outputParams: OutputParams): Promise<ProcessorResult> => {
        return await this._comparator.compareRanges(firstRange, secondRange, inputParams, outputParams);
    };
    
    extractData = async (
        contextId: uuid,
        inputParams: DataExtractionInputParams,
        outputParams: OutputParams): Promise<ProcessorResult> => {
        return await this._extractor.extractData(contextId, inputParams, outputParams);
    };
    
    storeData = async (
        contextId: uuid,
        records: any[],
        inputParams: DataStorageInputParams,
        outputParams: OutputParams): Promise<ProcessorResult> => {
        return await this._store.storeData(contextId, records, inputParams, outputParams);
    };
    
    removeData = async (
        contextId: uuid,
        records: any[],
        inputParams: DataStorageInputParams,
        outputParams: OutputParams): Promise<ProcessorResult> => {
        return await this._store.removeData(contextId, records, inputParams, outputParams);
    };
    
    calculateContinuity = async (
        records: any[],
        inputParams: ContinuityInputParams,
        outputParams: OutputParams): Promise<ProcessorResult> => {
        return await this._processor.calculateContinuity(records, inputParams, outputParams);
    };

}
