import {
    BaseSearchFilters,
    BaseSearchResults
} from "./miscellaneous/base.search.types";
import {
    uuid
} from "./miscellaneous/system.types";

export interface EventTypeCreateModel {
    SchemeId ? : uuid;
    ClientId ? : uuid;
    Name ? : string;
    Description ? : string;
    RootRuleNodeId ? : uuid;
}

export interface EventTypeUpdateModel {
    SchemeId ? : uuid;
    ClientId ? : uuid;
    Name ? : string;
    Description ? : string;
    RootRuleNodeId ? : uuid;
}

export interface EventTypeDto {
    id: uuid;
    SchemeId: uuid;
    ClientId: uuid;
    Name: string;
    Description: string;
    RootRuleNodeId: uuid;

}

export interface EventTypeSearchFilters extends BaseSearchFilters {
    SchemeId ? : uuid;
    ClientId ? : uuid;
    Name ? : string;
    RootRuleNodeId ? : uuid;
}

export interface EventTypeSearchResults extends BaseSearchResults {
    Items: EventTypeDto[];
}