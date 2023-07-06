import { Repository } from "typeorm";
import { FactsSource } from '../../../../fact.extractors/facts.db.connector';
import { MedicationFact } from '../../../../fact.extractors/models/medication.fact.model';
import { Context } from "../../../../../database/models/engine/context.model";
import { DataExtractionInputParams, DataSamplingMethod, OutputParams, ProcessorResult } from '../../../../../domain.types/engine/engine.types';
import { IExtractor } from "./extractor.interface";

//////////////////////////////////////////////////////////////////////

export class MedicationDataExtractor implements IExtractor {

    //#region Repositories

    _medicationRepository: Repository<MedicationFact> = FactsSource.getRepository(MedicationFact);

    public extract = async (
        context: Context,
        inputParams: DataExtractionInputParams,
        outputParams: OutputParams) => {

        const filters = inputParams.Filters ?? {};
        var samplingMethod = filters['SamplingMethod'] as DataSamplingMethod;
        if (!samplingMethod) {
            samplingMethod = DataSamplingMethod.All;
        }

        const records = await this._medicationRepository.find({
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
                const passed = arr.some(obj => obj.Taken  === true); // Check only for one record per day
                dayStats.push({
                    Day    : grKey,
                    Passed : passed,
                });
            }
        }
        else {
            for (var grKey of Object.keys(groupedRecords)) {
                const arr = groupedRecords[grKey];
                const passed = arr.every(obj => obj.Taken  === true); // Check all records for the day
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

/////////////////////////////////////////////////////////////////////

//scrap

// const transformed_ = [];
// const secondsInADay = 24 * 60 * 60;
// const difference = secondsInADay + 1;
// for(var i = 0; i < transformed.length; i++) {
//     const d = transformed[i];
//     const nextIndex = i + 1;
//     transformed_.push(d);
//     if (nextIndex < transformed.length) {
//         const dNext = transformed[nextIndex];
//         const dKey = d.key;
//         const dNextKey = dNext.key;
//         var dCurrentKey = dKey;
//         dCurrentKey = TimeUtils.addDuration(dCurrentKey, difference, DurationType.Second, false);
//         while (dCurrentKey < dNextKey) {
//             dCurrentKey = TimeUtils.addDuration(dCurrentKey, difference, DurationType.Second, false);
//             const missing = { key: dCurrentKey, value: false };
//             transformed_.push(missing);
//         }
//     }
// }

// const filtered = records.filter(x => x.Taken === false);
// const transformed = filtered.map(x => {
//     return {
//         MedicationId : x.MedicationId,
//         RecordDate : new Date(x.RecordDateStr)
//     };
// });
// return transformed;

// const records_ = await this._medicationRepository
//     .createQueryBuilder()
//     .select('med')
//     .from(MedicationFact, 'med')
//     .where("med.ContextReferenceId = :id", { id: context.ReferenceId })
//     .groupBy('med.RecordDateStr')
//     .getManyAndCount();

// const transformed = records.map(x => {
//     return {
//         MedicationId: x.MedicationId,
//         RecordDate: new Date(x.RecordDateStr)
//     };
// });

/////////////////////////////////////////////////////////////////////
