import { BadgeStockImageDto } from '../../../domain.types/badge.stock.image/badge.stock.image.dto';
import { BadgeStockImage } from '../../../database/models/awards/badge.stock.image.model';

///////////////////////////////////////////////////////////////////////////////////

export class BadgeStockImageMapper {

    static toResponseDto = (badgeStockImage: BadgeStockImage): BadgeStockImageDto => {
        if (badgeStockImage == null) {
            return null;
        }
        const dto: BadgeStockImageDto = {
            id         : badgeStockImage.id,
            Code       : badgeStockImage.Code,
            FileName   : badgeStockImage.FileName,
            ResourceId : badgeStockImage.ResourceId,
            PublicUrl  : badgeStockImage.PublicUrl
            
        };
        return dto;
    };

}
