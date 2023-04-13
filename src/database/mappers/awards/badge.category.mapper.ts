import { BadgeCategory } from '../../models/awards/badge.category.model';
import {
    BadgeCategoryResponseDto
} from '../../../domain.types/awards/badge.category.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class BadgeCategoryMapper {

    static toResponseDto = (category: BadgeCategory): BadgeCategoryResponseDto => {
        if (category == null) {
            return null;
        }
        const dto: BadgeCategoryResponseDto = {
            id      : category.id,
            Client: category.Client ? {
                id  : category.Client.id,
                Name: category.Client.Name,
                Code: category.Client.Code,
            } : null,
            Name       : category.Name,
            Description: category.Description,
            ImageUrl   : category.ImageUrl,
            CreatedAt  : category.CreatedAt,
            UpdatedAt  : category.UpdatedAt,
        };
        return dto;
    };

}
