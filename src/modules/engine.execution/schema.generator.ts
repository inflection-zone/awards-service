import {
    CompositionOperator,
    LogicalOperator,
    OperandDataType,
    EventActionType,
} from '../../domain.types/engine/engine.enums';

import {
    Condition,
    EventAction,
    EventActionParams,
    Node,
    Rule,
    Schema,
    uuid
} from './types';

export class SchemaGenerator {

    public generate = () =>{

        var schema = new Schema("HTN Diagnosis Protocol Schema");

        var rootNode = this.createRootNode(schema);
        var eligibilityRule = rootNode.Rules.find(x => x.Name == "Eligibility_Age_Range_Validity");
        schema.Nodes.push(rootNode);

        var bpMeasurementCountNode = this.createBPMeasurementCountNode(schema, rootNode.id);
        if (eligibilityRule && eligibilityRule.Event) {
            eligibilityRule.Event.Params.NextNodeId = bpMeasurementCountNode.id;
        }
        var bpMeasurementCountRule = bpMeasurementCountNode.Rules.find(x => x.Name == "Enough_BP_Measurements");
        schema.Nodes.push(bpMeasurementCountNode);

        var bpAnalysisNode = this.createBPAnalysisNode(schema, bpMeasurementCountNode.id);
        if (bpMeasurementCountRule && bpMeasurementCountRule.Event) {
            bpMeasurementCountRule.Event.Params.NextNodeId = bpAnalysisNode.id;
        }
        var moderateBPRule = bpAnalysisNode.Rules.find(x => x.Name == "BP_Systolic_GT_140_LT_159_And_Diastolic_GT_90_LT_99");
        var highBPRule = bpAnalysisNode.Rules.find(x => x.Name == "BP_Systolic_GT_160_LT_179_And_Diastolic_GT_100_LT_109");
        var severeBPRule = bpAnalysisNode.Rules.find(x => x.Name == "BP_Systolic_GT_180_And_Diastolic_GT_110");
        schema.Nodes.push(bpAnalysisNode);

        var moderateEvaluateRiskFactorsNode = this.createModerateEvaluateRiskFactorsNode(schema, bpAnalysisNode.id);
        if (moderateBPRule && moderateBPRule.Event) {
            moderateBPRule.Event.Params.NextNodeId = moderateEvaluateRiskFactorsNode.id;
        }
        schema.Nodes.push(moderateEvaluateRiskFactorsNode);

        var highEvaluateRiskFactorsNode = this.createHighEvaluateRiskFactorsNode(schema, bpAnalysisNode.id);
        if (highBPRule && highBPRule.Event) {
            highBPRule.Event.Params.NextNodeId = highEvaluateRiskFactorsNode.id;
        }
        schema.Nodes.push(highEvaluateRiskFactorsNode);

        var evaluateHTSeverityNode = this.createEvaluateHTSeverityNode(schema, bpAnalysisNode.id);
        if (severeBPRule && severeBPRule.Event) {
            severeBPRule.Event.Params.NextNodeId = evaluateHTSeverityNode.id;
        }
        schema.Nodes.push(evaluateHTSeverityNode);

        schema.RootNode = rootNode;

        return schema;
    }

    private createRootNode(schema: Schema) {
        var node = new Node(schema.id, null, "HTN Protocol Age Eligibility", "Check whether patient is eligible to process further.");
        var rule = this.createEligibleAgeRangeRule(node);
        rule = this.createUneligibleAgeRangeRule(node);
        return node;
    }

    private createBPMeasurementCountNode(schema: Schema, parentNodeId: uuid) {
        var node = new Node(schema.id, parentNodeId, "Verify 2 Measurements of blood pressure", "Check BP for two different days at health unit.");
        var rule = this.createEnoughBPMeasurementRule(node);
        var rule = this.createNotEnoughBPMeasurementRule(node);
        return node;
    }

    private createBPAnalysisNode(schema: Schema, parentNodeId: uuid) {
        var node = new Node(schema.id, parentNodeId, "Analyze blood pressure values", "Analyze blood pressure values.");
        var rule = this.createModerateBPRangeRule(node);
        rule = this.createHighBPRangeRule(node);
        rule = this.createVeryHighBPRangeRule(node);
        return node;
    }

    private createEvaluateHTSeverityNode(schema: Schema, parentNodeId: uuid) {
        var node = new Node(schema.id, parentNodeId, "Severe: Evaluate hypertension severity", "Evaluate HT severity for severe BP values.");
        return node;
    }

    private createHighEvaluateRiskFactorsNode(schema: Schema, parentNodeId: uuid) {
        var node = new Node(schema.id, parentNodeId, "High: Evaluate risk factors (Modifiable and non-modifiable)", "Evaluate risk factors (Modifiable and non-modifiable) for high values of BP.");
        return node;
    }

    private createModerateEvaluateRiskFactorsNode(schema: Schema, parentNodeId: uuid) {
        var node = new Node(schema.id, parentNodeId, "Moderate: Evaluate risk factors (Modifiable and non-modifiable)", "Evaluate risk factors (Modifiable and non-modifiable) for moderate values of BP.");
        return node;
    }

    private createVeryHighBPRangeRule(node: Node) {
        var rule = new Rule(node.id, "BP_Systolic_GT_180_And_Diastolic_GT_110", CompositionOperator.Or);

        var systolicBPCondition = Condition.createComposite(rule.id, rule.Condition, CompositionOperator.And);
        var condition = Condition.createLogical(rule.id, systolicBPCondition, 'SystolicBP', LogicalOperator.GreaterThanOrEqual, OperandDataType.Integer, 180);

        var diastolicBPCondition = Condition.createComposite(rule.id, rule.Condition, CompositionOperator.And);
        condition = Condition.createLogical(rule.id, diastolicBPCondition, 'DiastolicBP', LogicalOperator.GreaterThanOrEqual, OperandDataType.Integer, 110);
        condition = Condition.createLogical(rule.id, diastolicBPCondition, 'DiastolicBP', LogicalOperator.LessThanOrEqual, OperandDataType.Integer, 119);

        const params: EventActionParams = {
            Message: "Severe: Evaluate Hypertension severity.",
            Action: EventActionType.ExecuteNext,
            NextNodeId: null
        };

        const event = new EventAction(rule.id, "Evaluate Hypertension severity", "Evaluate severity of very high blood pressure values.", params);
        rule.Event = event;
        node.Rules.push(rule);
        return rule;
    }

    private createHighBPRangeRule(node: Node) {
        var rule = new Rule(node.id, "BP_Systolic_GT_160_LT_179_And_Diastolic_GT_100_LT_109", CompositionOperator.Or);

        var systolicBPCondition = Condition.createComposite(rule.id, rule.Condition, CompositionOperator.And);
        var condition = Condition.createLogical(rule.id, systolicBPCondition, 'SystolicBP', LogicalOperator.GreaterThanOrEqual, OperandDataType.Integer, 160);
        condition = Condition.createLogical(rule.id, systolicBPCondition, 'SystolicBP', LogicalOperator.LessThanOrEqual, OperandDataType.Integer, 179);

        var diastolicBPCondition = Condition.createComposite(rule.id, rule.Condition, CompositionOperator.And);
        condition = Condition.createLogical(rule.id, diastolicBPCondition, 'DiastolicBP', LogicalOperator.GreaterThanOrEqual, OperandDataType.Integer, 100);
        condition = Condition.createLogical(rule.id, diastolicBPCondition, 'DiastolicBP', LogicalOperator.LessThanOrEqual, OperandDataType.Integer, 109);

        const params: EventActionParams = {
            Message: "High: Evaluate risk factors (Modifiable and Non-modifiable).",
            Action: EventActionType.ExecuteNext,
            NextNodeId: null
        };

        const event = new EventAction(rule.id, "Evaluate risk factors (Modifiable and Non-modifiable", "Evaluate risk factors.", params);
        rule.Event = event;
        node.Rules.push(rule);
        return rule;
    }

    private createModerateBPRangeRule(node: Node) {
        var rule = new Rule(node.id, "BP_Systolic_GT_140_LT_159_And_Diastolic_GT_90_LT_99", CompositionOperator.Or);

        var systolicBPCondition = Condition.createComposite(rule.id, rule.Condition, CompositionOperator.And);
        var condition = Condition.createLogical(rule.id, systolicBPCondition, 'SystolicBP', LogicalOperator.GreaterThanOrEqual, OperandDataType.Integer, 140);
        condition = Condition.createLogical(rule.id, systolicBPCondition, 'SystolicBP', LogicalOperator.LessThanOrEqual, OperandDataType.Integer, 159);

        var diastolicBPCondition = Condition.createComposite(rule.id, rule.Condition, CompositionOperator.And);
        condition = Condition.createLogical(rule.id, diastolicBPCondition, 'DiastolicBP', LogicalOperator.GreaterThanOrEqual, OperandDataType.Integer, 90);
        condition = Condition.createLogical(rule.id, diastolicBPCondition, 'DiastolicBP', LogicalOperator.LessThanOrEqual, OperandDataType.Integer, 99);

        const params: EventActionParams = {
            Message: "Moderate: Evaluate risk factors (Modifiable and Non-modifiable).",
            Action: EventActionType.ExecuteNext,
            NextNodeId: null
        };

        const event = new EventAction(rule.id, "Moderate: Evaluate risk factors (Modifiable and Non-modifiable", "Evaluate risk factors.", params);
        rule.Event = event;
        node.Rules.push(rule);
        return rule;
    }

    private createEnoughBPMeasurementRule(node: Node) {
        var rule = new Rule(node.id, "Enough_BP_Measurements", CompositionOperator.And);
        var condition = Condition.createLogical(rule.id, rule.Condition, 'BPMeasurementCount', LogicalOperator.GreaterThanOrEqual, OperandDataType.Integer, 2);
        const params: EventActionParams = {
            Message: "Blood Pressure measurements count is enough for HTN diagnosis.",
            Action: EventActionType.ExecuteNext,
            NextNodeId: null
        };
        const event = new EventAction(rule.id, "Analyze BP values", "Proceed further to analyze blood pressure values.", params);
        rule.Event = event;
        node.Rules.push(rule);
        return rule;
    }

    private createNotEnoughBPMeasurementRule(node: Node) {
        var rule = new Rule(node.id, "Not_Enough_BP_Measurements", CompositionOperator.And);
        var condition = Condition.createLogical(rule.id, rule.Condition, 'BPMeasurementCount', LogicalOperator.LessThan, OperandDataType.Integer, 2);
        const params: EventActionParams = {
            Message: "Blood Pressure measurements count is not enough for HTN diagnosis. 2 or more measurements on different days are needed.",
            Action: EventActionType.WaitForInputEvents,
            NextNodeId: null
        };
        const event = new EventAction(rule.id, "Blood Pressure measurements count is not enough. Wait for enough measurements", "Wait for input events to check that there are atleast 2 or kore BP measurements.", params);
        rule.Event = event;
        node.Rules.push(rule);
        return rule;
    }

    private createEligibleAgeRangeRule(node: Node) {
        var rule = new Rule(node.id, "Eligibility_Age_Range_Validity", CompositionOperator.And);
        var condition = Condition.createLogical(rule.id, rule.Condition, 'Age', LogicalOperator.GreaterThanOrEqual, OperandDataType.Integer, 18);
        var condition = Condition.createLogical(rule.id, rule.Condition, 'Age', LogicalOperator.LessThanOrEqual, OperandDataType.Integer, 80);
        const params: EventActionParams = {
            Message: "Patient is eligible for HTN Diagnosis by age criteria.",
            Action: EventActionType.ExecuteNext,
            NextNodeId: null
        };
        const event = new EventAction(rule.id, "Eligible for HTN Diagnosis", "", params);
        rule.Event = event;
        node.Rules.push(rule);
        return rule;
    }

    private createUneligibleAgeRangeRule(node: Node) {
        var rule = new Rule(node.id, "Age_Not_Elligible", CompositionOperator.And);
        var condition = Condition.createLogical(rule.id, rule.Condition, 'Age', LogicalOperator.LessThan, OperandDataType.Integer, 18);
        var condition = Condition.createLogical(rule.id, rule.Condition, 'Age', LogicalOperator.GreaterThan, OperandDataType.Integer, 80);
        const params: EventActionParams = {
            Message: "Patient is not eligible for HTN diagnosis due to age criteria.",
            Action: EventActionType.Exit,
            NextNodeId: null
        };
        const event = new EventAction(rule.id, "Non-Eligible for HTN Diagnosis", "", params);
        rule.Event = event;
        node.Rules.push(rule);
        return rule;
    }


}
