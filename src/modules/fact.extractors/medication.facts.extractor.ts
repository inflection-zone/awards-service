import { Repository } from "typeorm";
import { Source } from "../../database/database.connector";
import { MedicationFact } from "./models/medication.fact.model";
import { uuid } from "../engine.execution/execution.types";
import { IExtractor } from "./extractor.interface";

export class MedicationFactsExtractor implements IExtractor {

    _medicationRepository: Repository<MedicationFact> = Source.getRepository(MedicationFact);

    extract(contextReferenceId: uuid, factName: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}
