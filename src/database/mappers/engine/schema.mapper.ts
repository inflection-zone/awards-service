import { Schema } from '../../models/engine/schema.model';
import {
    SchemaResponseDto
} from '../../../domain.types/engine/schema.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class SchemaMapper {

    static toResponseDto = (badge: Schema): SchemaResponseDto => {
        if (badge == null) {
            return null;
        }
        const dto: SchemaResponseDto = {
            id     : badge.id,
            Client : {
                id   : badge.Client.id,
                Name : badge.Client.Name,
                Code : badge.Client.Code,
            },
            Name        : badge.Name,
            Description : badge.Description,
            ValidFrom   : badge.ValidFrom,
            ValidTill   : badge.ValidTill,
            IsValid     : badge.IsValid,
            RootNodeId  : badge.RootNodeId,
            CreatedAt   : badge.CreatedAt,
            UpdatedAt   : badge.UpdatedAt,
        };
        return dto;
    };

}
