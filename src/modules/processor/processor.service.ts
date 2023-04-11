import { ProcessorResult } from '../../domain.types/engine/engine.enums';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { IDataComparator } from './interfaces/data.comparator.interface';
import { IDataExtractor } from './interfaces/data.extractor.interface';
import { IDataProcessor } from './interfaces/data.processor.interface';
import { injectable, inject } from 'tsyringe';

///////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class ProcessorService {

    constructor( 
            @inject('IDataComparator') private _comparator: IDataComparator,
            @inject('IDataExtractor') private _extractor: IDataExtractor, 
            @inject('IDataProcessor') private _processor: IDataProcessor, 
        ) {
        }

    compareRange = async (contextId: uuid, subject: any): Promise<ProcessorResult> => {
        return await this._comparator.compareRange(contextId, subject);
    }
    
    extractData = async (contextId: uuid, subject: any): Promise<ProcessorResult> => {
        return await this._extractor.extractData(contextId, subject);
    }
    
    calculateContinuity = async (contextId: uuid, records: any[], subject: any): Promise<ProcessorResult> => {
        return await this._processor.calculateContinuity(contextId, records, subject);
    }

}
