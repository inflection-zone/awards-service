import { uuid } from "../engine.execution/execution.types";

export interface IExtractor {

    extract(contextReferenceId: uuid, factName: string): Promise<any>;

}
