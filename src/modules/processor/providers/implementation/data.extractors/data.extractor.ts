import { uuid } from "../../../../../domain.types/miscellaneous/system.types";
import { IDataExtractor } from "../../../interfaces/data.extractor.interface";
import { Repository } from "typeorm";
import { Source } from '../../../../../database/database.connector';
import { Context } from "../../../../../database/models/engine/context.model";
import { logger } from "../../../../../logger/logger";
import { ErrorHandler } from "../../../../../common/handlers/error.handler";
import { DataExtractionInputParams, OutputParams, ProcessorResult } from '../../../../../domain.types/engine/engine.types';
import { MedicationDataExtractor } from './medication.data.extractor';
import { BadgeDataExtractor } from "./badge.data.extractor";
import { NutritionDataExtractor } from "./nutrition.data.extractor";
import { ExercisePhysicalActivityDataExtractor } from "./exercise.physical.activity.data.extractor";
import { VitalDataExtractor } from "./vital.data.extractor";
import { MentalHealthDataExtractor } from "./mental.health.data.extractor";

//////////////////////////////////////////////////////////////////////

export class DataExtractor implements IDataExtractor {

    //#region Repositories

    _contextRepository: Repository<Context> = Source.getRepository(Context);

    //#endregion

    extractData = async (
        contextId: uuid,
        inputParams: DataExtractionInputParams,
        outputParams: OutputParams): Promise<ProcessorResult> => {
            
        const context = await this.getContextById(contextId);
        const recordType = inputParams.RecordType;

        const extractor = this.extractor(recordType);
        if (extractor) {
            return await extractor.extract(context, inputParams, outputParams);
        }

        ErrorHandler.throwNotFoundError(`Data extractor not found for record type.`);
    };

    //#region Private methods

    private getContextById = async (id: uuid): Promise<Context> => {
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

    private extractor = (recordType: string) => {
        if (recordType === 'Medication') {
            return new MedicationDataExtractor();
        }
        else if (recordType === 'Badge') {
            return new BadgeDataExtractor();
        }
        else if (recordType === 'Nutrition') {
            return new NutritionDataExtractor();
        }
        else if (recordType === 'Exercise') {
            return new ExercisePhysicalActivityDataExtractor();
        }
        else if (recordType === 'Vital') {
            return new VitalDataExtractor();
        }
        else if (recordType === 'MentalHealth') {
            return new MentalHealthDataExtractor();
        }
        return null;
    };

    //#endregion

}
