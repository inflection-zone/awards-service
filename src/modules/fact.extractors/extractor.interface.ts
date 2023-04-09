import { uuid } from "../../domain.types/miscellaneous/system.types";

export interface IExtractor {

    extract(contextReferenceId: uuid, factName: string): Promise<any>;

}
