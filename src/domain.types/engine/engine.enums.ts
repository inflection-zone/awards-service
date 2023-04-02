
export enum ContextType {
    Person  = 'Person',
    Group   = 'Group',
}

export const ContextTypeList: ContextType[] = [
    ContextType.Person,
    ContextType.Group,
];

export enum SchemaType {
    //Only one instance active at a time for a given context. This is for cases where a long running
    //workflow is represented
    OnlyOneInstanceActive = 'OnlyOneInstanceActive',

    //On every incoming event, create a new instance. This is suitable for usecases,
    //where on every event we want to check some light weight logic execution.
    CreateNewInstanceAlways = 'CreateNewInstanceAlways',

    //These kind of schemas are for cases where they get executed only once for a given context.
    //For example, awarding some promotion coupons on a given occasion.
    OnlyOneInstanceInLifetime = 'OnlyOneInstanceInLifetime'
}

export const SchemaTypeList: SchemaType[] = [
    SchemaType.CreateNewInstanceAlways,
    SchemaType.OnlyOneInstanceActive,
    SchemaType.OnlyOneInstanceInLifetime,
];

export enum OperatorType {
    Logical      = 'Logical',
    Mathematical = 'Mathematical',
    Composition  = 'Composition',
}

export const OperatorList: OperatorType[] = [
    OperatorType.Logical,
    OperatorType.Mathematical,
    OperatorType.Composition,
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
    Equal              = 'Equal',
    NotEqual           = 'NotEqual',
    GreaterThan        = 'GreaterThan',
    GreaterThanOrEqual = 'GreaterThanOrEqual',
    LessThan           = 'LessThan',
    LessThanOrEqual    = 'LessThanOrEqual',
    In                 = 'In',
    NotIn              = 'NotIn',
    Contains           = 'Contains',
    DoesNotContain     = 'DoesNotContain',
    Between            = 'Between',
    IsTrue             = 'IsTrue',
    IsFalse            = 'IsFalse',
    Exists             = 'Exists',
    None               = 'None',
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
}

export const ConditionOperandDataTypeList: OperandDataType[] = [
    OperandDataType.Float,
    OperandDataType.Integer,
    OperandDataType.Boolean,
    OperandDataType.Text,
    OperandDataType.Array,
];

export enum EventActionType {
    ExecuteNext = "ExecuteNext",
    WaitForInputEvents = "WaitForInputEvents",
    Exit = "Exit",
    AwardBadge = "AwardBadge",
    AwardPoints = "AwardPoints",
    Custom = "Custom",
}

export const EventActionTypeList: EventActionType[] = [
    EventActionType.ExecuteNext,
    EventActionType.WaitForInputEvents,
    EventActionType.Exit,
    EventActionType.AwardBadge,
    EventActionType.AwardPoints,
    EventActionType.Custom,
];

export enum ExecutionStatus {
    Pending = "Pending",
    Executed = "Executed",
    Waiting = "Waiting",
    Exited = "Exited",
}

export const ExecutionStatusList: ExecutionStatus[] = [
    ExecutionStatus.Pending,
    ExecutionStatus.Executed,
    ExecutionStatus.Waiting,
    ExecutionStatus.Exited,
];
