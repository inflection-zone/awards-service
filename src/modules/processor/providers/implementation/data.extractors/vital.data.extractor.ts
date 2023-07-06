import { Repository } from "typeorm";
import { FactsSource } from '../../../../fact.extractors/facts.db.connector';
import { Context } from "../../../../../database/models/engine/context.model";
import { DataExtractionInputParams, DataSamplingMethod, OutputParams, ProcessorResult } from '../../../../../domain.types/engine/engine.types';
import { IExtractor } from "./extractor.interface";
import { VitalFact } from "../../../../../modules/fact.extractors/models/vital.fact.model";

//////////////////////////////////////////////////////////////////////

export class VitalDataExtractor  implements IExtractor {

    //#region Repositories

    _vitalFactRepository: Repository<VitalFact> =
        FactsSource.getRepository(VitalFact);

    //#endregion
    
    public extract = async (
        context: Context,
        inputParams: DataExtractionInputParams,
        outputParams: OutputParams) => {

        const filters = inputParams.Filters ?? {};
        var samplingMethod = filters['SamplingMethod'] as DataSamplingMethod;
        if (!samplingMethod) {
            samplingMethod = DataSamplingMethod.Any;
        }
    
        const records = await this._vitalFactRepository.find({
            where : {
                ContextReferenceId : context.ReferenceId
            },
        });
    
        const groupedRecords = records.reduce((acc, obj) => {
            const key = obj.RecordDateStr;
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(obj);
            return acc;
        }, {});
    
        const dayStats: { Day: string; Passed: boolean;}[] = [];
        if (samplingMethod === DataSamplingMethod.Any) {
            for (var grKey of Object.keys(groupedRecords)) {
                const arr = groupedRecords[grKey];
                const passed = arr.some(obj => obj.VitalPrimaryValue  !== null); // Check only for one record per day
                dayStats.push({
                    Day    : grKey,
                    Passed : passed,
                });
            }
        }
        else {
            for (var grKey of Object.keys(groupedRecords)) {
                const arr = groupedRecords[grKey];
                const passed = arr.every(obj => obj.VitalPrimaryValue  !== null); // Check all records for the day
                dayStats.push({
                    Day    : grKey,
                    Passed : passed,
                });
            }
        }
    
        const sorted = dayStats.sort((a, b) => Date.parse(a.Day) - Date.parse(b.Day));
        const transformed = sorted.map(x => {
            return {
                key   : new Date(x.Day),
                value : x.Passed,
            };
        });
            
        const result: ProcessorResult = {
            Success : true,
            Tag     : outputParams.OutputTag,
            Data    : transformed
        };

        return result;
    };

}
