import { uuid } from "../execution.types";

export interface IExtractor {

    extract(contextId: uuid, factName: string): Promise<any>;

}
