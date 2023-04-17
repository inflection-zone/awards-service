import { ProcessorResult } from '../../domain.types/engine/engine.types';
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

    compareRanges = async (subject: any, firstRange: any[], secondRange: any[]): Promise<ProcessorResult> => {
        return await this._comparator.compareRanges(subject, firstRange, secondRange);
    }
    
    extractData = async (contextId: uuid, subject: any): Promise<ProcessorResult> => {
        return await this._extractor.extractData(contextId, subject);
    }
    
    storeData = async (contextId: uuid, subject: any, records: any[]): Promise<ProcessorResult> => {
        return await this._store.storeData(contextId, subject, records);
    }
    
    calculateContinuity = async (contextId: uuid, records: any[], subject: any): Promise<ProcessorResult> => {
        return await this._processor.calculateContinuity(contextId, records, subject);
    }

}
