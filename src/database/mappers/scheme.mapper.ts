import {
    SchemeDto
} from '../../domain.types/scheme.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class SchemeMapper {

    static toDto = (scheme: any): SchemeDto => {
        if (scheme == null) {
            return null;
        }
        const dto: SchemeDto = {
            id          : scheme.id,
            ClientId    : scheme.ClientId,
            Name        : scheme.Name,
            Description : scheme.Description,
            ValidFrom   : scheme.ValidFrom,
            ValidTill   : scheme.ValidTill,
        };
        return dto;
    };

}
