import { FileResource } from '../../models/general/file.resource.model';
import {
    FileResourceResponseDto,
} from '../../../domain.types/general/file.resource.domain.types';
import { FileResourceMetadata } from '../../../domain.types/general/file.resource/file.resource.types';
import { ConfigurationManager } from '../../../config/configuration.manager';
import { FileResourceVersion } from '../../../database/models/general/file.resource.version.model';

///////////////////////////////////////////////////////////////////////////////////

export class FileResourceMapper {

    static toResponseDto = (fileResource: FileResource): FileResourceResponseDto => {
        if (fileResource == null) {
            return null;
        }
        const dto: FileResourceResponseDto = {
            id               : fileResource.id,
            StorageKey       : fileResource.StorageKey,
            OriginalFilename : fileResource.OriginalFilename,
            DownloadCount    : fileResource.DownloadCount,
            MimeType         : fileResource.MimeType,
            Public           : fileResource.Public,
            Size             : fileResource.Size,
            Tags             : fileResource.Tags,
            UploadedBy       : null,
            CreatedAt        : fileResource.CreatedAt,
            UpdatedAt        : fileResource.UpdatedAt,
        };
        return dto;
    };

    static toFileVersionDto = (fileVersion ?: FileResourceVersion, sanitize = false): FileResourceMetadata => {

        if (fileVersion == null){
            return null;
        }

        var url = ConfigurationManager.BaseUrl + '/file-resources/' + fileVersion.ResourceId + '/download-by-version-name/' + fileVersion.Version;

        var v: FileResourceMetadata = {
            VersionId    : fileVersion.id,
            ResourceId   : fileVersion.ResourceId,
            Version      : fileVersion.Version,
            FileName     : fileVersion.FileName,
            MimeType     : fileVersion.MimeType,
            OriginalName : fileVersion.OriginalFileName,
            Size         : fileVersion.SizeInKB,
            StorageKey   : fileVersion.StorageKey,
            Url          : url
        };

        if (sanitize) {
            v.StorageKey = null;
        }

        return v;
    };


}
