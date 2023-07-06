import { BaseSearchFilters, BaseSearchResults } from "../miscellaneous/base.search.types";
import { uuid } from "../miscellaneous/system.types";

export interface FileResourceCreateModel {
    StorageKey       ?: string;
    MimeType         ?: string;
    Metadata         ?: any;
    OriginalFilename ?: string;
    UserId           ?: uuid;
    Size             ?: number;
    Public           ?: boolean;
    DownloadCount    ?: number;
    Tags             ?: string[];
}

export interface FileResourceResponseDto {
    id              : uuid;
    StorageKey      : string;
    MimeType        : string;
    OriginalFilename: string;
    Size            : number;
    Public          : boolean;
    DownloadCount   : number;
    Tags            : string[];
    UploadedBy      : uuid;
    CreatedAt       : Date;
    UpdatedAt       : Date;
}

export interface FileResourceSearchFilters extends BaseSearchFilters {
    Filename?: string;
    UserId?  : uuid;
    Tags?    : string;
}

export interface FileResourceSearchResults extends BaseSearchResults {
    Items: FileResourceResponseDto[];
}
