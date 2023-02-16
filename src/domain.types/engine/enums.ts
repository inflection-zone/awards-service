
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
}

export const MathematicalOperatorList: MathematicalOperator[] = [
    MathematicalOperator.Add,
    MathematicalOperator.Subtract,
    MathematicalOperator.Divide,
    MathematicalOperator.Multiply,
    MathematicalOperator.Percentage,
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
}

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
