import { writeFileSync } from "fs";
import { PatientData } from "./data";
import { RuleConverter } from "../rule.converter";
import { SchemaEngine } from "../schema.engine";
import { TestSchemaGenerator } from "./test.schema.generator";

var generator = new TestSchemaGenerator();
const schema = generator.generate();

printSchema();

(async () => {
    var node = await executeWorkflow('Joe Biden');
    node = await executeWorkflow('Vladimir Putin');
    node = await executeWorkflow('Emmanuel Macron');
})();

function printSchema() {
    var nodes = [];
    var facts = [];

    for (var n of schema.Nodes) {

        var nodeName = n.Name;
        var rules = n.Rules;
        var decisions = [];
        for (var r of rules) {
            var rObj = RuleConverter.convertRule(r);
            rObj["rule"] = r.Name;
            decisions.push(rObj);
        }
        var node = {
            node: nodeName,
            rules: decisions,
        };
        nodes.push(node);

        var f = n.extractFacts();
        if (Array.isArray(f)) {
            facts.push({
                node: n.Name,
                facts: f
            });
        }
    }
    var str = JSON.stringify(schema, null, 2);
    writeFileSync('./output/schema_htn.json', str);
    var str = JSON.stringify(nodes, null, 2);
    writeFileSync('./output/rules.json', str);
    var str = JSON.stringify(facts, null, 2);
    writeFileSync('./output/facts.json', str);
}

async function executeWorkflow(context: string) {
    console.log(`\n%cExecuting workflow for ${context} >>>`, 'color: orange');
    var context_ = PatientData.find(x => x.Name == context);
    var c = context_ ?? undefined;
    if (c) {
        var node = await SchemaEngine.execute(schema, c);
        return node;
    }
    return undefined;
}
