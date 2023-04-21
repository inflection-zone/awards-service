import { uuid } from "../../domain.types/miscellaneous/system.types";
import { IExtractor } from "../fact.extractors/extractor.interface";

///////////////////////////////////////////////////////////////////////////

export default class FactCollector {

    _extractors: { Fact: string; Extractor: IExtractor }[] = [];

    public collectFacts = async (contextReferenceId: uuid, factNames: string[]): Promise<any[]> => {
        const facts = [];
        for await (var fact of factNames) {
            var extractor = this._extractors.find(x => x.Fact === fact);
            if (extractor) {
                var extracted = extractor.Extractor.extract(contextReferenceId, fact);
                facts.push(extracted);
            }
        }
        return facts;
    };

}
