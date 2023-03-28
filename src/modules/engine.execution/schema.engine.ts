import { Engine } from 'json-rules-engine';
import { SchemaConverter } from './schema.converter';
import {
    SNodeInstance,
    SSchema,
    SSchemaInstance } from './execution.types';
import { EventActionType, ExecutionStatus } from '../../domain.types/engine/engine.enums';
import { logger } from '../../logger/logger';

///////////////////////////////////////////////////////////////////////////////

export class SchemaEngine {

    public static execute = async (schema: SSchema, facts: any) =>{
        
        var schemaInstance = new SSchemaInstance(schema);
        var rootNodeInstance = schemaInstance.RootNode;
        var currentNode = rootNodeInstance as SNodeInstance;

        logger.info(`\nCurrent node    : ${currentNode.Name}`);
        logger.info(`Current node Id : ${currentNode.id}\n`);

        while (currentNode.Status === ExecutionStatus.Pending) {
            currentNode = await SchemaEngine.traverse(
                schemaInstance,
                currentNode,
                facts,
                facts.Name);
        }
        return currentNode;
    };

    private static async traverse(
        schema: SSchemaInstance,
        currentNode: SNodeInstance,
        facts: any,
        context: string) {

        const rules = currentNode.Rules;
        var facts: any = SchemaEngine.extractFactsForNode(facts, currentNode);
        var successEvent: any = undefined;

        for (var r of rules) {
            const engine = new Engine();
            var rule = SchemaConverter.convertRule(r);
            engine.addRule(rule);
            engine.on('success', async (event, almanac) => {
                successEvent = event;
                logger.info(`%cRule Execution Result: '${r.Name}' has passed for context '${context}'.`);
            });
            engine.on('failure', async (event, almanac)=> {
                logger.error(`%cRule Execution Result: '${r.Name}' has failed for context '${context}'.`);
            });
            const results = await engine.run(facts);
        }

        if (successEvent) {

            //logger.info(`successEvent = ${JSON.stringify(successEvent, null, 2)}`);

            var action = successEvent.params?.Action as EventActionType;
            var nextNodeId = successEvent.params?.NextNodeId;
            if (action === EventActionType.ExecuteNext && nextNodeId != null) {
                var nextNode = schema.Nodes.find(x => x.NodeId === nextNodeId);
                if (nextNode) {
                    currentNode.Status = ExecutionStatus.Executed;
                    currentNode = nextNode;
                    logger.info(`\nCurrent node    : ${currentNode.Name}`);
                    logger.info(`Current node Id : ${currentNode.id}\n`);
                }
            }
            else if (action === EventActionType.WaitForInputEvents) {
                currentNode.Status = ExecutionStatus.Waiting;
                logger.warn(`%cWaiting for input events for necessary facts!`);
            }
        }
        else {
            currentNode.Status = ExecutionStatus.Executed;
        }

        return currentNode;
    }

    private static extractFactsForNode(incomingFacts: any, currentNode: SNodeInstance) {
        var factKeys = Object.keys(incomingFacts.Facts);
        var nodeFactNames: string[] = currentNode.extractFacts();
        var facts: any = {};
        for (var fn of nodeFactNames) {
            var foundFactKey = factKeys.find(x => x === fn);
            if (foundFactKey) {
                var factValue = incomingFacts.Facts[fn];
                facts[fn] = factValue;
            }
            else {
                facts[fn] = undefined;
                logger.info(`Needed fact-${fn} is not yet available!`);
            }
        }
        return facts;
    }

}
