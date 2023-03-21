import { Schema } from '../../models/engine/schema.model';
import {
    SchemaResponseDto
} from '../../../domain.types/engine/schema.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class SchemaMapper {

    static toResponseDto = (schema: Schema): SchemaResponseDto => {
        if (schema == null) {
            return null;
        }
        const dto: SchemaResponseDto = {
            id     : schema.id,
            Client : {
                id   : schema.Client.id,
                Name : schema.Client.Name,
                Code : schema.Client.Code,
            },
            Name        : schema.Name,
            Description : schema.Description,
            ValidFrom   : schema.ValidFrom,
            ValidTill   : schema.ValidTill,
            IsValid     : schema.IsValid,
            RootNodeId  : schema.RootNodeId,
            CreatedAt   : schema.CreatedAt,
            UpdatedAt   : schema.UpdatedAt,
        };
        return dto;
    };

}
