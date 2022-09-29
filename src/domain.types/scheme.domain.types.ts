import {
    BaseSearchFilters,
    BaseSearchResults
} from "./miscellaneous/base.search.types";
import {
    uuid
} from "./miscellaneous/system.types";

export interface SchemeCreateModel {
    ClientId ? : uuid;
    Name ? : string;
    Description ? : string;
}

export interface SchemeUpdateModel {
    ClientId ? : uuid;
    Name ? : string;
    Description ? : string;
}

export interface SchemeDto {
    id: uuid;
    ClientId: uuid;
    Name: string;
    Description: string;
    ValidFrom: Date;
    ValidTill: Date;

}

export interface SchemeSearchFilters extends BaseSearchFilters {
    ClientId ? : uuid;
    Name ? : string;
    ValidFrom ? : Date;
    ValidTill ? : Date;
}

export interface SchemeSearchResults extends BaseSearchResults {
    Items: SchemeDto[];
}
