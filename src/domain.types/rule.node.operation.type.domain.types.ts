import {
    BaseSearchFilters,
    BaseSearchResults,
} from "./miscellaneous/base.search.types";
import {
    Composition,
    Logical,
    Mathematical
} from "./miscellaneous/rule.node.operation.type";
export interface RuleNodeOperationTypeCreateModel {
    Composition: Composition;Logical: Logical;Mathematical: Mathematical;
}

export interface RuleNodeOperationTypeUpdateModel {
    Composition ? : Composition;
    Logical ? : Logical;
    Mathematical ? : Mathematical;
}

export interface RuleNodeOperationTypeDto {
    Composition: Composition;
    Logical: Logical;
    Mathematical: Mathematical;

}

export interface RuleNodeOperationTypeSearchFilters extends BaseSearchFilters {
    Composition ? : Composition;
    Logical ? : Logical;
    Mathematical ? : Mathematical;
}

export interface RuleNodeOperationTypeSearchResults extends BaseSearchResults {
    Items: RuleNodeOperationTypeDto[];
}
