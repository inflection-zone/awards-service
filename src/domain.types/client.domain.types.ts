import {
    BaseSearchFilters,
    BaseSearchResults
} from "./miscellaneous/base.search.types";
import {
    uuid
} from "./miscellaneous/system.types";

export interface ClientCreateModel {
    ClientName: string;ClientCode ? : string;Phone ? : string;Email ? : string;
}

export interface ClientUpdateModel {
    ClientName ? : string;
    ClientCode ? : string;
    Phone ? : string;
    Email ? : string;
}

export interface ClientDto {
    id: uuid;
    ClientName: string;
    ClientCode: string;
    Phone: string;
    Email: string;

}

export interface ClientSearchFilters extends BaseSearchFilters {
    ClientName ? : string;
    ClientCode ? : string;
}

export interface ClientSearchResults extends BaseSearchResults {
    Items: ClientDto[];
}