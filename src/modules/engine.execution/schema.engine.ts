import { Engine } from 'json-rules-engine';
import { RuleConverter } from './rule.converter';
import {
    CContext,
    CNodeInstance,
    CSchemaInstance } from './execution.types';
import { EventActionType, ExecutionStatus } from '../../domain.types/engine/engine.enums';
import { logger } from '../../logger/logger';
import { SchemaInstanceResponseDto } from '../../domain.types/engine/schema.instance.types';
import { ExecutionTypesGenerator } from './execution.types.generator';
import FactCollector from './fact.collector';
import { Loader } from '../../startup/loader';
import { ProcessorService } from '../processor/processor.service';

///////////////////////////////////////////////////////////////////////////////

export class SchemaEngine {

    public static execute = async (dbSchemaInstance: SchemaInstanceResponseDto) =>{
        
        const generator = new ExecutionTypesGenerator();
        var schemaInstance = await generator.createSchemaInstance(dbSchemaInstance);

        const factCollector = new FactCollector();
        const facts = factCollector.collectFacts(schemaInstance.Context.ReferenceId, schemaInstance.FactNames);

        var rootNodeInstance = schemaInstance.RootNodeInstance;
        var currentNode = rootNodeInstance as CNodeInstance;

        logger.info(`Current node    : ${currentNode.Name}`);
        logger.info(`Current node Id : ${currentNode.id}`);

        while (currentNode.ExecutionStatus === ExecutionStatus.Pending) {
            currentNode = await SchemaEngine.traverse(
                schemaInstance.Context,
                schemaInstance,
                currentNode,
                facts,
            );
        }
        return currentNode;
    };

    private static async traverse(
        context: CContext,
        schema: CSchemaInstance,
        currentNode: CNodeInstance,
        facts: any
        ) {

        const processor = Loader.Container.resolve(ProcessorService);

        const rules = currentNode.Rules;
        if (rules.length > 0) {
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
        }
        else if (currentNode.Action) {

            // Execute this node's default action and then move onto the next node
            const action = currentNode.Action;
            const actionType = action.ActionType;

            if (actionType === EventActionType.ExtractData) {
                //Extract data based on the action subject filters
                const subject = action.ActionSubject;
                if (subject.RecordType === 'Medication') {
                    
                }
                else if (subject.RecordType === 'Badge') {

                }
            }
            else if (actionType === EventActionType.ProcessData) {
                //
            }
            else if (actionType === EventActionType.CompareData) {
                //
            }
            else if (actionType === EventActionType.StoreData) {
                //
            }
            else if (actionType === EventActionType.Custom) {
                //
            }
            else if (actionType === EventActionType.Exit) {
                //
            }
            else if (actionType === EventActionType.ExecuteNext) {
                //
            }
            else if (actionType === EventActionType.WaitForInputEvents) {
                //
            }
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
