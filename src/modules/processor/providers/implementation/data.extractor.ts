import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { IDataExtractor } from "../../interfaces/data.extractor.interface";
import { Repository } from "typeorm";
import { FactsSource } from '../../../fact.extractors/facts.db.connector';
import { Source } from '../../../../database/database.connector';
import { MedicationFact } from '../../../fact.extractors/models/medication.fact.model';
import { BadgeFact } from '../../../fact.extractors/models/bedge.facts.model';
import { Context } from "../../../../database/models/engine/context.model";
import { logger } from "../../../../logger/logger";
import { ErrorHandler } from "../../../../common/handlers/error.handler";
import { ParticipantBadge } from "../../../../database/models/awards/participant.badge.model";
import { DataExtractionInputParams, DataSamplingMethod, OutputParams, ProcessorResult } from '../../../../domain.types/engine/engine.types';

//////////////////////////////////////////////////////////////////////

export class DataExtractor implements IDataExtractor {

    //#region Repositories

    _medicationRepository: Repository<MedicationFact> = FactsSource.getRepository(MedicationFact);

    _badgeRepository: Repository<BadgeFact> = FactsSource.getRepository(BadgeFact);

    _participantBadgeRepository: Repository<ParticipantBadge> = Source.getRepository(ParticipantBadge);

    _contextRepository: Repository<Context> = Source.getRepository(Context);

    //#endregion

    extractData = async (
        contextId: uuid, 
        inputParams: DataExtractionInputParams, 
        outputParams: OutputParams): Promise<ProcessorResult> => {
            
        const context = await this.getContextById(contextId);
        const recordType = inputParams.RecordType;

        if (recordType === 'Medication') {
            return await this.extractMedicationData(context, inputParams, outputParams.OutputTag);            
        }
        else if (recordType === 'Badge') {
            const filters = {};
            filters['RecordType'] = recordType;
            if (inputParams.Filters) {
                for (var f of inputParams.Filters) {
                    filters[f.Key] = f.Value;
                }
            }
            return await this.extractBadgeData(context, filters, outputParams.OutputTag);   
        }

        ErrorHandler.throwNotFoundError(`Data extractor not found for record type.`);
    };

    //#region Private methods

    public getContextById = async (id: uuid): Promise<Context> => {
        try {
            var context = await this._contextRepository.findOne({
                where : {
                    id : id
                },
            });
            return context;
        } catch (error) {
            logger.error(error.message);
        }
    };

    private extractMedicationData = async (context: Context, filters: any, tag: string) => {

        var samplingMethod = filters['SamplingMethod'] as DataSamplingMethod;
        if (!samplingMethod) {
            samplingMethod = DataSamplingMethod.Any;
        }

        const records = await this._medicationRepository.find({
            where: {
                ContextReferenceId: context.ReferenceId
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
                    Day: grKey,
                    Passed: passed,
                });
            }
        }
        else {
            for (var grKey of Object.keys(groupedRecords)) {
                const arr = groupedRecords[grKey];
                const passed = arr.every(obj => obj.Taken  === true); // Check all records for the day
                dayStats.push({
                    Day: grKey,
                    Passed: passed,
                });
            }
        }

        const sorted = dayStats.sort((a, b) => Date.parse(a.Day) - Date.parse(b.Day));
        const transformed = sorted.map(x => { 
            return { 
                key  : new Date(x.Day),
                value: x.Passed,
            };
        });

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

        const result: ProcessorResult = {
            Success: true,
            Tag    : tag,
            Data   : transformed
        };

        return result;
    };

    private extractBadgeData = async (context: Context, filters: any, tag: string) => {

        const records = await this._participantBadgeRepository.find({
            where: {
                Participant: {
                    ReferenceId : context.ReferenceId
                },
                Badge: {
                    Name    : filters.BadgeTitle,
                    Category: {
                        Name : filters.BadgeCategory
                    }
                }
            },
            select : {
                id          : true,
                AcquiredDate: true,
                Badge       : {
                    id      : true,
                    Category: {
                        id         : true,
                        Name       : true,
                        Description: true,
                    },
                    Name       : true,
                    Description: true,
                    ImageUrl   : true,
                },
                Participant: {
                    id         : true,
                    ReferenceId: true,
                },
                Metadata: true,
            },
            relations: {
                Participant: true,
                Badge: {
                    Category: true,
                }
            }
        });

        var refined = [];
        for (var r of records) {
            var metadata = JSON.parse(r.Metadata);
            var start = (new Date(metadata.start)).toISOString().split('T')[0];
            var end = (new Date(metadata.end)).toISOString().split('T')[0];
            var key = `(${start})-(${end})-(${r.Badge.Name})`;
            refined.push({ start, end, key });
        }
        
        const result: ProcessorResult = {
            Success: true,
            Tag    : tag,
            Data   : refined
        };

        return result;
    };

    //#endregion

}
