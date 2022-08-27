import {
    BaseSearchFilters,
    BaseSearchResults
} from "./miscellaneous/base.search.types";
import {
    uuid
} from "./miscellaneous/system.types";

export interface EventActionTypeCreateModel {
    SchemeId ? : uuid;
    EventId ? : uuid;
    ClientId ? : uuid;
    Name ? : string;
    RootRuleNodeId ? : uuid;
}

export interface EventActionTypeUpdateModel {
    SchemeId ? : uuid;
    EventId ? : uuid;
    ClientId ? : uuid;
    Name ? : string;
    RootRuleNodeId ? : uuid;
}

export interface EventActionTypeDto {
    id: uuid;
    SchemeId: uuid;
    EventId: uuid;
    ClientId: uuid;
    Name: string;
    RootRuleNodeId: uuid;

}

export interface EventActionTypeSearchFilters extends BaseSearchFilters {
    SchemeId ? : uuid;
    EventId ? : uuid;
    ClientId ? : uuid;
    Name ? : string;
    RootRuleNodeId ? : uuid;
}

export interface EventActionTypeSearchResults extends BaseSearchResults {
    Items: EventActionTypeDto[];
}