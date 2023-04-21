import { FileResource } from '../../models/general/file.resource.model';
import {
    FileResourceResponseDto,
} from '../../../domain.types/general/file.resource.domain.types';

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
            UploadedBy       : fileResource.UploadedBy.id,
            CreatedAt        : fileResource.CreatedAt,
            UpdatedAt        : fileResource.UpdatedAt,
        };
        return dto;
    };

}
