import { Privilege } from '../../../database/models/user/privilege.model';
import {
    PrivilegeResponseDto
} from '../../../domain.types/user/privilege.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class PrivilegeMapper {

    static toResponseDto = (privilege: Privilege): PrivilegeResponseDto => {
        if (privilege == null) {
            return null;
        }
        const dto: PrivilegeResponseDto = {
            id          : privilege.id,
            Name        : privilege.Name,
            Description : privilege.Description,
            CreatedAt   : privilege.CreatedAt,
            UpdatedAt   : privilege.UpdatedAt
        };
        return dto;
    };

}
