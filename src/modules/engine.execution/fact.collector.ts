import { uuid } from "./execution.types";
import { IExtractor } from "./fact.extractors/extractor.interface";

///////////////////////////////////////////////////////////////////////////

export default class FactCollector {

    _extractors: { Fact: string; Extractor: IExtractor }[] = [];

    public collectFacts = async (contextId: uuid, factNames: string[]): Promise<any[]> => {
        const facts = [];
        for await (var fact of factNames) {
            var extractor = this._extractors.find(x => x.Fact === fact);
            if (extractor) {
                var extracted = extractor.Extractor.extract(contextId, fact);
                facts.push(extracted);
            }
        }
        return facts;
    };

}
