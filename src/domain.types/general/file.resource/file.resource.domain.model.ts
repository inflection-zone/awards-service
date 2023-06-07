import { FileResourceMetadata, ResourceReference } from "./file.resource.types";

export interface FileResourceUploadDomainModel {
    FileMetadata            : FileResourceMetadata;
    OwnerUserId?            : string;
    UploadedByUserId?       : string;
    Public?                 : boolean;
    IsMultiResolutionImage? : boolean;
    MimeType?               : string;
    DefaultVersionId?       : string;
    StorageKey?             : string;
    FileName?               : string;
}

export interface FileResourceRenameDomainModel {
    id?         : string,
    NewFileName : string;
}

export interface FileResourceUpdateModel {
    FileMetadata?           : FileResourceMetadata;
    ResourceId              : string;
    References?             : ResourceReference[];
    Tags?                   : string[];
    IsMultiResolutionImage? : boolean;
}
