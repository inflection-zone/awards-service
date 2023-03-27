import { Engine } from 'json-rules-engine';
import { SchemaConverter } from './schema.converter';
import {
    NodeExecutionInstance,
    Schema,
    SchemaExecutionInstance} from './types';
import { EventActionType, ExecutionStatus } from '../../domain.types/engine/engine.enums';

export class SchemaEngine {

    public static execute = async (schema: Schema, patientFacts: any) =>{
        var schemaInstance = new SchemaExecutionInstance(schema);
        var rootNodeInstance = schemaInstance.RootNode;
        var currentNode = rootNodeInstance as NodeExecutionInstance;

        console.log(`\nCurrent node    : ${currentNode.Name}`);
        console.log(`Current node Id : ${currentNode.id}\n`);

        while (currentNode.Status === ExecutionStatus.Pending) {
            currentNode = await SchemaEngine.traverse(
                schemaInstance,
                currentNode,
                patientFacts,
                patientFacts.Name);
        }
        return currentNode;
    }

    private static async traverse(
        schema: SchemaExecutionInstance,
        currentNode: NodeExecutionInstance,
        facts: any,
        context: string) {

        var rules = currentNode.Rules;
        var facts: any = SchemaEngine.extractFactsForNode(facts, currentNode);
        var successEvent: any = undefined;
        var successEvent: any = undefined;

        for (var r of rules) {
            const engine = new Engine();
            var rule = SchemaConverter.convertRule(r);
            engine.addRule(rule);
            engine.on('success', async (event, almanac) => {
                successEvent = event;
                console.log(`%cRule Execution Result: '${r.Name}' has passed for context '${context}'.`,'color: green');
            });
            engine.on('failure', async (event, almanac)=> {
                console.log(`%cRule Execution Result: '${r.Name}' has failed for context '${context}'.`,'color: orangered');
            });
            let results = await engine.run(facts);
        }

        if (successEvent) {

            //console.log(`successEvent = ${JSON.stringify(successEvent, null, 2)}`);

            var action = successEvent.params?.Action as EventActionType;
            var nextNodeId = successEvent.params?.NextNodeId;
            if (action === EventActionType.ExecuteNext && nextNodeId != null) {
                var nextNode = schema.Nodes.find(x => x.NodeId === nextNodeId);
                if (nextNode) {
                    currentNode.Status = ExecutionStatus.Executed;
                    currentNode = nextNode;
                    console.log(`\nCurrent node    : ${currentNode.Name}`);
                    console.log(`Current node Id : ${currentNode.id}\n`);
                }
            }
            else if (action === EventActionType.WaitForInputEvents) {
                currentNode.Status = ExecutionStatus.Waiting;
                console.log(`%cWaiting for input events for necessary facts!`, 'color: yellow');
            }
        }
        else {
            currentNode.Status = ExecutionStatus.Executed;
        }

        return currentNode;
    }

    private static extractFactsForNode(incomingFacts: any, currentNode: NodeExecutionInstance) {
        var factKeys = Object.keys(incomingFacts.Facts);
        var nodeFactNames: string[] = currentNode.extractFacts();
        var facts: any = {};
        for (var fn of nodeFactNames) {
            var foundFactKey = factKeys.find(x => x == fn);
            if (foundFactKey) {
                var factValue = incomingFacts.Facts[fn];
                facts[fn] = factValue;
            }
            else {
                facts[fn] = undefined;
                console.log(`Needed fact-${fn} is not yet available!`);
            }
        }
        return facts;
    }
}
