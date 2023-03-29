import { Engine } from 'json-rules-engine';
import { RuleConverter } from './rule.converter';
import {
    CNodeInstance,
    CSchema,
    CSchemaInstance } from './execution.types';
import { EventActionType, ExecutionStatus } from '../../domain.types/engine/engine.enums';
import { logger } from '../../logger/logger';
import { SchemaInstanceResponseDto } from '../../domain.types/engine/schema.instance.types';
import { ExecutionTypesGenerator } from './execution.types.generator';

///////////////////////////////////////////////////////////////////////////////

export class SchemaEngine {

    public static execute = async (dbSchemaInstance: SchemaInstanceResponseDto, facts: any) =>{
        
        const generator = new ExecutionTypesGenerator();
        var schemaInstance = await generator.createSchemaInstance(dbSchemaInstance);

        var rootNodeInstance = schemaInstance.RootNodeInstance;
        var currentNode = rootNodeInstance as CNodeInstance;

        logger.info(`\nCurrent node    : ${currentNode.Name}`);
        logger.info(`Current node Id : ${currentNode.id}\n`);

        while (currentNode.ExecutionStatus === ExecutionStatus.Pending) {
            currentNode = await SchemaEngine.traverse(
                schemaInstance,
                currentNode,
                facts,
                facts.Name);
        }
        return currentNode;
    };

    private static async traverse(
        schema: CSchemaInstance,
        currentNode: CNodeInstance,
        facts: any,
        context: string) {

        const rules = currentNode.Rules;
        var facts: any = SchemaEngine.extractFactsForNode(facts, currentNode);
        var successEvent: any = undefined;

        for (var r of rules) {
            const engine = new Engine();
            var rule = RuleConverter.convertRule(r);
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
                    currentNode.ExecutionStatus = ExecutionStatus.Executed;
                    currentNode = nextNode;
                    logger.info(`\nCurrent node    : ${currentNode.Name}`);
                    logger.info(`Current node Id : ${currentNode.id}\n`);
                }
            }
            else if (action === EventActionType.WaitForInputEvents) {
                currentNode.ExecutionStatus = ExecutionStatus.Waiting;
                logger.warn(`%cWaiting for input events for necessary facts!`);
            }
        }
        else {
            currentNode.ExecutionStatus = ExecutionStatus.Executed;
        }

        return currentNode;
    }

    private static extractFactsForNode(incomingFacts: any, currentNode: CNodeInstance) {
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
