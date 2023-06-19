import { Badge } from '../../models/awards/badge.model';
import {
    BadgeDto,
    BadgeResponseDto
} from '../../../domain.types/awards/badge.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class BadgeMapper {

    static toResponseDto = (badge: Badge): BadgeResponseDto => {
        if (badge == null) {
            return null;
        }
        const dto: BadgeResponseDto = {
            id      : badge.id,
            Category: {
                id         : badge.Category.id,
                Name       : badge.Category.Name,
                Description: badge.Category.Description,
            },
            Client: {
                id  : badge.Client.id,
                Name: badge.Client.Name,
                Code: badge.Client.Code,
            },
            Name       : badge.Name,
            Description: badge.Description,
            ImageUrl   : badge.ImageUrl,
            HowToEarn  : badge.HowToEarn,
            CreatedAt  : badge.CreatedAt,
            UpdatedAt  : badge.UpdatedAt,
        };
        return dto;
    };

    static toDto = (badge: Badge): BadgeDto => {
        if (badge == null) {
            return null;
        }
        const dto: BadgeDto = {
            id         : badge.id,
            Name       : badge.Name,
            Description: badge.Description,
            ImageUrl   : badge.ImageUrl,
            HowToEarn  : badge.HowToEarn,
            CreatedAt  : badge.CreatedAt,
            UpdatedAt  : badge.UpdatedAt,
        };
        return dto;
    };

}
