import { Role } from '../../../database/models/user/role.model';
import {
    RoleResponseDto
} from '../../../domain.types/user/role.domain.types';
import { PrivilegeMapper } from './privilege.mapper';

///////////////////////////////////////////////////////////////////////////////////

export class RoleMapper {

    static toResponseDto = (role: Role): RoleResponseDto => {
        if (role == null) {
            return null;
        }
        const dto: RoleResponseDto = {
            id          : role.id,
            Name        : role.Name,
            Description : role.Description,
            Privileges  : role.Privileges?.map(x => PrivilegeMapper.toResponseDto(x)),
            CreatedAt   : role.CreatedAt,
            UpdatedAt   : role.UpdatedAt
        };
        return dto;
    };

}
