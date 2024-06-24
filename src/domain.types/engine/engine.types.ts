
import { uuid } from "../miscellaneous/system.types";

export enum ContextType {
    Person  = 'Person',
    Group   = 'Group',
}

export const ContextTypeList: ContextType[] = [
    ContextType.Person,
    ContextType.Group,
];

export enum SchemaType {
    //These kind of schemas are for cases where they get executed only once for a given context.
    //For example, awarding some promotion coupons on a given occasion.
    ExecuteOnce = 'Execute-Once',

    //On every incoming event, reuse the same instance. This is suitable for usecases,
    //where on every event we want to check some light weight logic execution.
    ReuseExistingInstance = 'Reuse-Existing-Instance',

    //Recreate new instance after the execution of the previous one.
    RecreateNewAfterExecution = 'Recreate-New-After-Execution'
}

export enum NodeType {
    //This node type has set of rules to be executed.
    //Based on rule execution results, an action is taken at the end.
    RuleNode = 'Rule-Node',

    //This node type contains some execution steps and once processed,
    //the control moves to next node defined or schema exits.
    ExecutionNode = 'Execution-Node',

    //This node type is meant to send messages to the listening parties.
    MessageNode = 'Message-Node'
}

export const SchemaTypeList: SchemaType[] = [
    SchemaType.ExecuteOnce,
    SchemaType.ReuseExistingInstance,
    SchemaType.RecreateNewAfterExecution,
];

export enum OperatorType {
    Logical      = 'Logical',
    Mathematical = 'Mathematical',
    Composition  = 'Composition',
    Iterate      = 'Iterate'
}

export const OperatorList: OperatorType[] = [
    OperatorType.Logical,
    OperatorType.Mathematical,
    OperatorType.Composition,
    OperatorType.Iterate,
];

export enum CompositionOperator {
    And  = 'And',
    Or   = 'Or',
    None = 'None'
}

export const CompositionOperatorList: CompositionOperator[] = [
    CompositionOperator.And,
    CompositionOperator.Or,
    CompositionOperator.None,
];

export enum LogicalOperator {
    Equal                     = 'Equal',
    NotEqual                  = 'NotEqual',
    GreaterThan               = 'GreaterThan',
    GreaterThanOrEqual        = 'GreaterThanOrEqual',
    LessThan                  = 'LessThan',
    LessThanOrEqual           = 'LessThanOrEqual',
    In                        = 'In',
    NotIn                     = 'NotIn',
    Contains                  = 'Contains',
    DoesNotContain            = 'DoesNotContain',
    Between                   = 'Between',
    IsTrue                    = 'IsTrue',
    IsFalse                   = 'IsFalse',
    Exists                    = 'Exists',
    HasConsecutiveOccurrences = 'HasConsecutiveOccurrences', //array, checkFor, numTimes
    RangesOverlap             = 'RangesOverlap',
    None                      = 'None',
}

export const LogicalOperatorList: LogicalOperator[] = [
    LogicalOperator.Equal,
    LogicalOperator.NotEqual,
    LogicalOperator.GreaterThan,
    LogicalOperator.GreaterThanOrEqual,
    LogicalOperator.LessThan,
    LogicalOperator.LessThanOrEqual,
    LogicalOperator.In,
    LogicalOperator.NotIn,
    LogicalOperator.Contains,
    LogicalOperator.DoesNotContain,
    LogicalOperator.Between,
    LogicalOperator.IsTrue,
    LogicalOperator.IsFalse,
    LogicalOperator.Exists,
    LogicalOperator.HasConsecutiveOccurrences,
    LogicalOperator.RangesOverlap,
    LogicalOperator.None,
];

export enum MathematicalOperator {
    Add        = 'Add',
    Subtract   = 'Subtract',
    Divide     = 'Divide',
    Multiply   = 'Multiply',
    Percentage = 'Percentage',
    None       = 'None',
}

export const MathematicalOperatorList: MathematicalOperator[] = [
    MathematicalOperator.Add,
    MathematicalOperator.Subtract,
    MathematicalOperator.Divide,
    MathematicalOperator.Multiply,
    MathematicalOperator.Percentage,
    MathematicalOperator.None,
];

export enum OperandDataType {
    Float   = 'Float',
    Integer = 'Integer',
    Boolean = 'Boolean',
    Text    = 'Text',
    Array   = 'Array',
    Object  = 'Object',
    Date    = 'Date',
}

export const ConditionOperandDataTypeList: OperandDataType[] = [
    OperandDataType.Float,
    OperandDataType.Integer,
    OperandDataType.Boolean,
    OperandDataType.Text,
    OperandDataType.Array,
    OperandDataType.Object,
    OperandDataType.Date,
];

export enum EventActionType {
    ExecuteNext        = "Execute-Next",
    WaitForInputEvents = "Wait-For-Input-Events",
    Exit               = "Exit",
    AwardBadge         = "Award-Badge",
    AwardPoints        = "Award-Points",
    ProcessData        = "Process-Data",
    ExtractData        = "Extract-Data",
    CompareData        = "Compare-Data",
    StoreData          = "Store-Data",
    Custom             = "Custom",
}

export const EventActionTypeList: EventActionType[] = [
    EventActionType.ExecuteNext,
    EventActionType.WaitForInputEvents,
    EventActionType.Exit,
    EventActionType.AwardBadge,
    EventActionType.AwardPoints,
    EventActionType.ProcessData,
    EventActionType.ExtractData,
    EventActionType.CompareData,
    EventActionType.StoreData,
    EventActionType.Custom,
];

export enum DataActionType {
    CalculateContinuity = "Calculate-Continuity",
    FindRangeDifference = "Find-Range-Difference",
    MaximumInRange      = "Maximum-In-Range",
    MinimumInRange      = "Minimum-In-Range",
    CalculatePercentile = "Calculate-Percentile",
}

export const DataActionTypeList: DataActionType[] = [
    DataActionType.CalculateContinuity,
    DataActionType.FindRangeDifference,
    DataActionType.MaximumInRange,
    DataActionType.MinimumInRange,
    DataActionType.CalculatePercentile,
];

export enum ExecutionStatus {
    Pending  = "Pending",
    Executed = "Executed",
    Waiting  = "Waiting",
    Exited   = "Exited",
}

export const ExecutionStatusList: ExecutionStatus[] = [
    ExecutionStatus.Pending,
    ExecutionStatus.Executed,
    ExecutionStatus.Waiting,
    ExecutionStatus.Exited,
];

export enum InputSourceType {
    Database    = "Database",
    Almanac     = "Almanac",
    ApiEndpoint = "ApiEndpoint",
}

export const InputSourceTypeList: InputSourceType[] = [
    InputSourceType.Database,
    InputSourceType.Almanac,
    InputSourceType.ApiEndpoint,
];

export interface ActionInputParams {
    RecordType        : string;
    SourceType        : InputSourceType;
    InputTag         ?: string;
    SecondaryInputTag?: string;
}

export interface DataExtractionInputParams extends ActionInputParams {
    Filters ?: {
        Key  : string;
        Value: string;
    }[];
    RecordDateFrom?: Date;
    RecordDateTo  ?: Date;
}

export interface ContinuityInputParams extends ActionInputParams {
    DataActionType ?: DataActionType;
    KeyDataType    ?: OperandDataType;
    KeyName        ?: string;
    ValueDataType  ?: OperandDataType;
    ValueName      ?: string;
    Value          ?: any;
    SecondaryValue ?: any;
    Operator        : LogicalOperator;
    ContinuityCount : number;
}

export interface ValueComparisonInputParams extends ActionInputParams {
    DataActionType ?: DataActionType;
    Filters ?: {
        Key  : string;
        Value: string;
    }[];
}

export interface RangeComparisonInputParams extends ActionInputParams {
    DataActionType ?: DataActionType;
    Filters ?: {
        Key  : string;
        Value: string;
    }[];
}

export interface DataStorageInputParams extends ActionInputParams {
    StorageKeys ?: {
        Key  : string;
        Value: string;
    }[];
}

export enum OutputDestinationType {
    Database    = "Database",
    Almanac     = "Almanac",
    ApiEndpoint = "ApiEndpoint",
}

export const OutputSourceTypeList: OutputDestinationType[] = [
    OutputDestinationType.Database,
    OutputDestinationType.Almanac,
    OutputDestinationType.ApiEndpoint,
];

export interface ActionOutputParams {
    DestinationType : OutputDestinationType;
    Message         : string;
    OutputTag       : string;
    NextNodeId     ?: uuid | undefined;
    Extra?          : any | undefined;
}

export interface ProcessorResult {
    Success: boolean;
    Tag    : string;
    Data   : any[] | any;
}

export type InputParams = DataExtractionInputParams |
                          DataStorageInputParams |
                          ContinuityInputParams |
                          ValueComparisonInputParams |
                          RangeComparisonInputParams |
                          ActionInputParams;

export type OutputParams = ActionOutputParams;

export enum DataSamplingMethod {
    Any     = "Any",
    All     = "All",
    Average = "Average",
}

export const DataSamplingMethodList: DataSamplingMethod[] = [
    DataSamplingMethod.Any,
    DataSamplingMethod.All,
    DataSamplingMethod.Average,
];
