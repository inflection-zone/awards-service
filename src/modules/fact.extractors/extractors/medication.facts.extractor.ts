import { Repository } from "typeorm";
import { Source } from "../../../database/database.connector";
import { MedicationFact } from "../models/medication.fact.model";
import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { IExtractor } from "../extractor.interface";

export class MedicationFactsExtractor implements IExtractor {

    _medicationRepository: Repository<MedicationFact> = Source.getRepository(MedicationFact);

    extract = async (contextReferenceId: uuid, factName: string): Promise<any> => {
        if (factName === 'Medication') {
            // const records = await this._medicationRepository.find({
            //     where: {
            //         ContextReferenceId: contextReferenceId
            //     }
            // });
            // const filtered = records.filter(x => x.Taken === false);
            // const transformed = filtered.map(x => {
            //     return {
            //         MedicationId : x.MedicationId,
            //         RecordDate : new Date(x.RecordDateStr)
            //     };
            // });
            // return transformed;
            const records = await this._medicationRepository
               .createQueryBuilder()
               .select('medicationFact')
               .from(MedicationFact, 'medicationFact')
               .where("medicationFact.ContextReferenceId = :id", { id: contextReferenceId })
               .groupBy('RecordDateStr')
               .getRawMany();

            const transformed = records.map(x => {
                return {
                    MedicationId : x.MedicationId,
                    RecordDate : new Date(x.RecordDateStr)
                };
            });
        }
        return [];
    }

    getConsecutiveOccurrences = (records: any[], predicate, numOccurrences: number) => {
        let count = 0;
        const foundBundles = [];
        var bundle = [];
        for (let i = 0; i < records.length; i++) {
            if (predicate(records[i])) {
                count++;
                bundle.push(records[i]);
                if (count === numOccurrences) {
                    foundBundles.push(bundle);
                    count = 0;
                    bundle = [];
                }
            } else {
                count = 0;
                bundle = [];
            }
        }
        return foundBundles;
    }



}
