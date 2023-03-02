import { UserResponseDto } from '../../../domain.types/user/user.domain.types';
import { User } from '../../models/user/user.model';
import { ClientMapper } from '../client/client.mapper';
import { RoleMapper } from './role.mapper';

///////////////////////////////////////////////////////////////////////////////////

export class UserMapper {

    static toResponseDto = (user: User): UserResponseDto => {
        if (user == null) {
            return null;
        }
        const dto: UserResponseDto = {
            id          : user.id,
            UserName    : user.UserName,
            Prefix      : user.Prefix,
            FirstName   : user.FirstName,
            LastName    : user.LastName,
            CountryCode : user.CountryCode,
            Phone       : user.Phone,
            Email       : user.Email,
            Gender      : user.Gender,
            BirthDate   : user.BirthDate,
            Role        : RoleMapper.toResponseDto(user.Roles?.length > 0 ? user.Roles[0] : null),
            Client      : ClientMapper.toResponseDto(user.Client),
            CreatedAt   : user.CreatedAt,
            UpdatedAt   : user.UpdatedAt
        };
        return dto;
    };

}
