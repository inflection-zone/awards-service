import {
    BaseSearchFilters,
    BaseSearchResults
} from "./miscellaneous/base.search.types";
import {
    uuid
} from "./miscellaneous/system.types";

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