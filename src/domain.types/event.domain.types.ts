import {
    BaseSearchFilters,
    BaseSearchResults
} from "./miscellaneous/base.search.types";
import {
    uuid
} from "./miscellaneous/system.types";

export interface EventCreateModel {
    EventTypeId ? : uuid;
    ParticipantId ? : uuid;
    SchemeId ? : uuid;
    RootRuleNodeId ? : uuid;
}

export interface EventUpdateModel {
    EventTypeId ? : uuid;
    ParticipantId ? : uuid;
    SchemeId ? : uuid;
    RootRuleNodeId ? : uuid;
}

export interface EventDto {
    id: uuid;
    EventTypeId: uuid;
    ParticipantId: uuid;
    SchemeId: uuid;
    Timestamp: Date;
    RootRuleNodeId: uuid;

}

export interface EventSearchFilters extends BaseSearchFilters {
    EventTypeId ? : uuid;
    ParticipantId ? : uuid;
    SchemeId ? : uuid;
    Timestamp ? : Date;
    RootRuleNodeId ? : uuid;
}

export interface EventSearchResults extends BaseSearchResults {
    Items: EventDto[];
}