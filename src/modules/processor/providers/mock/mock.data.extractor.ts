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
import { DataExtractionInputParams, OutputParams, ProcessorResult } from "../../../../domain.types/engine/engine.types";

//////////////////////////////////////////////////////////////////////

export class MockDataExtractor implements IDataExtractor {


    extractData = async (contextId: uuid, 
        inputParams: DataExtractionInputParams, 
        outputParams: OutputParams): Promise<ProcessorResult> => {
        throw new Error("Method not implemented.");
    };

}
