import { Repository } from "typeorm";
import { Source } from "../../../database/database.connector";
import { MedicationFact } from "../models/medication.fact.model";
import { uuid } from "../../engine.execution/execution.types";
import { IExtractor } from "../extractor.interface";

export class MedicationFactsExtractor implements IExtractor {

    _medicationRepository: Repository<MedicationFact> = Source.getRepository(MedicationFact);

    extract = async (contextReferenceId: uuid, factName: string): Promise<any> => {
        if (factName === 'MedicationsMissed') {
            const records = await this._medicationRepository.find({
                where: {
                    ContextReferenceId: contextReferenceId
                }
            });
            const filtered = records.filter(x => x.Taken === false);
            const transformed = filtered.map(x => {
                return {
                    MedicationId : x.MedicationId,
                    RecordDate : new Date(x.RecrodDateStr)
                };
            });
            return transformed;
        }
        return [];
    }

}
