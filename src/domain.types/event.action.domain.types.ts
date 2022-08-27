import {
    BaseSearchFilters,
    BaseSearchResults
} from "./miscellaneous/base.search.types";
import {
    uuid
} from "./miscellaneous/system.types";

export interface EventActionCreateModel {
    EventActionTypeId ? : uuid;
    ParticipantId ? : uuid;
    SchemeId ? : uuid;
    RootRuleNodeId ? : uuid;
}

export interface EventActionUpdateModel {
    EventActionTypeId ? : uuid;
    ParticipantId ? : uuid;
    SchemeId ? : uuid;
    RootRuleNodeId ? : uuid;
}

export interface EventActionDto {
    id: uuid;
    EventActionTypeId: uuid;
    ParticipantId: uuid;
    SchemeId: uuid;
    Timestamp: Date;
    RootRuleNodeId: uuid;

}

export interface EventActionSearchFilters extends BaseSearchFilters {
    EventActionTypeId ? : uuid;
    ParticipantId ? : uuid;
    SchemeId ? : uuid;
    Timestamp ? : Date;
    RootRuleNodeId ? : uuid;
}

export interface EventActionSearchResults extends BaseSearchResults {
    Items: EventActionDto[];
}