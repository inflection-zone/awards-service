import {
    BaseSearchFilters,
    BaseSearchResults
} from "../miscellaneous/base.search.types";
import {
    uuid
} from "../miscellaneous/system.types";
import { CompositionOperator, LogicalOperator, MathematicalOperator, OperandDataType, OperatorType } from "./engine.enums";

//////////////////////////////////////////////////////////////

export interface ConditionCreateModel {
    Name                  : string;
    Description          ?: string;
    RuleId                : uuid;
    ParentConditionId     : uuid;
    Operator             ?: OperatorType;
    Fact                 ?: string;
    DataType              : OperandDataType;
    Value                ?: any;
    LogicalOperator      ?: LogicalOperator;
    MathematicalOperator ?: MathematicalOperator;
    CompositionOperator  ?: CompositionOperator;
}

export interface ConditionUpdateModel {
    Name                 ?: string;
    Description          ?: string;
    RuleId               ?: uuid;
    ParentConditionId    ?: uuid;
    Operator             ?: OperatorType;
    Fact                 ?: string;
    DataType             ?: OperandDataType;
    Value                ?: any;
    LogicalOperator      ?: LogicalOperator;
    MathematicalOperator ?: MathematicalOperator;
    CompositionOperator  ?: CompositionOperator;
}

export interface ConditionResponseDto {
    id                  : uuid;
    Name                : string;
    Description         : string;
    Operator            : OperatorType;
    DataType            : OperandDataType;
    Fact                : string;
    Value               : any;
    LogicalOperator     : LogicalOperator;
    MathematicalOperator: MathematicalOperator;
    CompositionOperator : CompositionOperator;
    Rule                : {
        id          : uuid;
        Name        : string;
        Description : string;
        ParentNodeId: uuid;
    };
    ParentCondition : {
        id: uuid;
        Name: string;
        Description: string;
    }
    ChildrenConditions : {
        id: uuid;
        Name: string;
        Description: string;
    }[];
    CreatedAt: Date;
    UpdatedAt: Date;
}

export interface ConditionSearchFilters extends BaseSearchFilters {
    Name             ?: string;
    RuleId           ?: uuid;
    ParentConditionId?: uuid;
}

export interface ConditionSearchResults extends BaseSearchResults {
    Items: ConditionResponseDto[];
}
