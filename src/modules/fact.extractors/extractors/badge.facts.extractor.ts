import { uuid } from '../../../domain.types/miscellaneous/system.types';
import { IExtractor } from "../extractor.interface";

export class BadgeFactsExtractor implements IExtractor {

    extract(contextReferenceId: uuid, factName: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}
