import { Repository } from "typeorm";
import { FactsSource } from '../../../../fact.extractors/facts.db.connector';
import { Context } from "../../../../../database/models/engine/context.model";
import { DataExtractionInputParams, DataSamplingMethod, OutputParams, ProcessorResult } from '../../../../../domain.types/engine/engine.types';
import { IExtractor } from "./extractor.interface";
import { ExercisePhysicalActivityFact } from "../../../../../modules/fact.extractors/models/exercise.physical.activity.fact.model";

//////////////////////////////////////////////////////////////////////

export class ExercisePhysicalActivityDataExtractor  implements IExtractor {

    //#region Repositories

    _physicalActivityRepository: Repository<ExercisePhysicalActivityFact> =
        FactsSource.getRepository(ExercisePhysicalActivityFact);

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
    
        const records = await this._physicalActivityRepository.find({
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
                const passed = arr.some(obj => obj.PhysicalActivityQuestionAns  === true); // Check only for one record per day
                dayStats.push({
                    Day    : grKey,
                    Passed : passed,
                });
            }
        }
        else {
            for (var grKey of Object.keys(groupedRecords)) {
                const arr = groupedRecords[grKey];
                const passed = arr.every(obj => obj.PhysicalActivityQuestionAns  === true); // Check all records for the day
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
