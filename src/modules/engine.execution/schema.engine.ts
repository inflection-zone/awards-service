import { Engine } from 'json-rules-engine';
import { RuleConverter } from './rule.converter';
import {
    CContext,
    CNodeInstance,
    CSchemaInstance } from './execution.types';
import { ContinuityInputParams, DataActionType, EventActionType, ExecutionStatus, OutputParams, RangeComparisonInputParams } from '../../domain.types/engine/engine.types';
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
        const facts = await factCollector.collectFacts(dbSchemaInstance.Context.ReferenceId, schemaInstance.FactNames);

        var rootNodeInstance = schemaInstance.RootNodeInstance;
        var currentNodeInstance = rootNodeInstance as CNodeInstance;

        logger.info(`Current node    : ${currentNodeInstance.Name}`);
        logger.info(`Current node Id : ${currentNodeInstance.id}`);

        while (currentNodeInstance.ExecutionStatus === ExecutionStatus.Pending) {
            currentNodeInstance = await SchemaEngine.traverse(
                schemaInstance.Context,
                schemaInstance,
                currentNodeInstance,
                facts,
            );
        }
        return currentNodeInstance;
    };

    private static async traverse(
        context: CContext,
        schemaInstance: CSchemaInstance,
        currentNodeInstance: CNodeInstance,
        facts: any
        ): Promise<CNodeInstance> {

        const processor = Loader.Container.resolve(ProcessorService);

        const rules = currentNodeInstance.Rules;
        if (rules.length > 0) {
            var facts: any = SchemaEngine.extractFactsForNode(facts, currentNodeInstance);
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
        else if (currentNodeInstance.Action) {

            // Execute this node's default action and then move onto the next node
            const action = currentNodeInstance.Action;
            const actionType = action.ActionType;

            if (actionType === EventActionType.ExtractData) {
                //Extract data based on the action subject filters
                const data = await processor.extractData(context.id, action.InputParams, action.OutputParams);
                schemaInstance.Almanac.push({
                    Name: data.Tag,
                    Data: data.Data
                });
                return SchemaEngine.getNextNode(currentNodeInstance, schemaInstance);
            }
            else if (actionType === EventActionType.ProcessData) {
                const subject = action.InputParams;
                const dataActionType = subject.DataActionType;
                const almanacObject = schemaInstance.fetchAlmanacData(subject.InputTag);
                if (!almanacObject) {
                    throw new Error(`Records with tag ${subject.InputTag} not found in schema almanac.`);
                }
                if (dataActionType === DataActionType.CalculateContinuity) {
                    const data = await processor.calculateContinuity(
                        almanacObject.Data, 
                        action.InputParams as ContinuityInputParams, 
                        action.OutputParams as OutputParams);
                    schemaInstance.Almanac.push({
                        Name: data.Tag,
                        Data: data.Data
                    });
                }

                return SchemaEngine.getNextNode(currentNodeInstance, schemaInstance);
            }
            else if (actionType === EventActionType.CompareData) {
                const inputParams = action.InputParams;
                const dataActionType = inputParams.DataActionType;
                const almanacObjectFirst = schemaInstance.fetchAlmanacData(inputParams.InputTag);
                if (!almanacObjectFirst) {
                    throw new Error(`Records with tag ${inputParams.InputTag} not found in schema almanac.`);
                }
                const almanacObjectSecond = schemaInstance.fetchAlmanacData(inputParams.SecondaryInputTag);
                if (!almanacObjectSecond) {
                    throw new Error(`Records with tag ${inputParams.SecondaryInputTag} not found in schema almanac.`);
                }
                if (dataActionType === DataActionType.FindRangeDifference) {
                    const data = await processor.compareRanges(
                        almanacObjectFirst.Data, 
                        almanacObjectSecond.Data,
                        action.InputParams as RangeComparisonInputParams, 
                        action.OutputParams as OutputParams);
                    schemaInstance.Almanac.push({
                        Name: data.Tag,
                        Data: data.Data
                    });
                }

                return SchemaEngine.getNextNode(currentNodeInstance, schemaInstance);
            }
            else if (actionType === EventActionType.StoreData) {
                const inputParams = action.InputParams;
                const almanacObject = schemaInstance.fetchAlmanacData(inputParams.InputTag);
                if (!almanacObject) {
                    throw new Error(`Records with tag ${inputParams.InputTag} not found in schema almanac.`);
                }
                const data = await processor.storeData(context.id, almanacObject.Data?.ToBeAdded, action.InputParams, action.OutputParams);
                schemaInstance.Almanac.push({
                    Name: data.Tag,
                    Data: data.Data
                });
                return SchemaEngine.getNextNode(currentNodeInstance, schemaInstance);
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
                var nextNode = schemaInstance.NodeInstances.find(x => x.NodeId === nextNodeId);
                if (nextNode) {
                    currentNodeInstance.ExecutionStatus = ExecutionStatus.Executed;
                    currentNodeInstance = nextNode;
                    logger.info(`\nCurrent node    : ${currentNodeInstance.Name}`);
                    logger.info(`Current node Id : ${currentNodeInstance.id}\n`);
                }
            }
            else if (action === EventActionType.WaitForInputEvents) {
                currentNodeInstance.ExecutionStatus = ExecutionStatus.Waiting;
                logger.warn(`%cWaiting for input events for necessary facts!`);
            }
        }
        else {
            currentNodeInstance.ExecutionStatus = ExecutionStatus.Executed;
        }

        return currentNodeInstance;
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

    private static getNextNode = (currentNodeInstance, schemaInstance) => {
        if (currentNodeInstance.Action && 
            currentNodeInstance.Action.OutputParams && 
            currentNodeInstance.Action.OutputParams.NextNodeId) {
            const nextNodeId = currentNodeInstance.Action.OutputParams.NextNodeId;
            const nodeInstances = schemaInstance.NodeInstances;
            const newCurrentNodeInstance = nodeInstances.find(x => x.NodeId === nextNodeId);
            if (newCurrentNodeInstance) {
                return newCurrentNodeInstance;
            }
        }
        return null;
    };

}
