import {
    BaseSearchFilters,
    BaseSearchResults
} from "./miscellaneous/base.search.types";
import {
    uuid
} from "./miscellaneous/system.types";

export interface RedemptionCreateModel {
    ClientId ? : uuid;
    SchemeId ? : uuid;
    ParticipantId ? : uuid;
    Name ? : string;
    Description ? : string;
    RootRuleNodeId ? : uuid;
}

export interface RedemptionUpdateModel {
    ClientId ? : uuid;
    SchemeId ? : uuid;
    ParticipantId ? : uuid;
    Name ? : string;
    Description ? : string;
    RootRuleNodeId ? : uuid;
}

export interface RedemptionDto {
    id: uuid;
    ClientId: uuid;
    SchemeId: uuid;
    ParticipantId: uuid;
    Name: string;
    Description: string;
    RedemptionDate: Date;
    RedemptionStatus: string;
    RootRuleNodeId: uuid;

}

export interface RedemptionSearchFilters extends BaseSearchFilters {
    ClientId ? : uuid;
    SchemeId ? : uuid;
    ParticipantId ? : uuid;
    Name ? : string;
    RedemptionDate ? : Date;
    RedemptionStatus ? : string;
    RootRuleNodeId ? : uuid;
}

export interface RedemptionSearchResults extends BaseSearchResults {
    Items: RedemptionDto[];
}