import { logger } from '../../../logger/logger';
import { ApiError, ErrorHandler } from '../../../common/handlers/error.handler';
import { Source } from '../../database.connector';
import { Repository } from 'typeorm';
import { BadgeStockImage } from '../../../database/models/awards/badge.stock.image.model';
import { BadgeStockImageDomainModel } from '../../../domain.types/badge.stock.image/badge.stock.image.domain.model';
import { BadgeStockImageDto } from '../../../domain.types/badge.stock.image/badge.stock.image.dto';
import { BadgeStockImageMapper } from '../../../database/mappers/awards/badge.stock.image.mapper';

///////////////////////////////////////////////////////////////////////

export class BadgeStockImageService {

    //#region Repositories

    _badgeStockRepository: Repository<BadgeStockImage> = Source.getRepository(BadgeStockImage);

    //#endregion

    public create = async (createModel: BadgeStockImageDomainModel): Promise<BadgeStockImageDto> => {
        try {
            const badgeStockImages = this._badgeStockRepository.create({
                Code       : createModel.Code,
                FileName   : createModel.FileName,
                ResourceId : createModel.ResourceId,
                PublicUrl  : createModel.PublicUrl,
            
            });
            var record = await this._badgeStockRepository.save(badgeStockImages);
            return BadgeStockImageMapper.toResponseDto(record);
        } catch (error) {
            logger.error(error.message);
            ErrorHandler.throwInternalServerError(error.message, 500);
        }
    };

    getAll = async (): Promise<BadgeStockImageDto[]> => {
        try {

            const foundResults = await this._badgeStockRepository.find();

            const dtos: BadgeStockImageDto[] = [];
            for (const stockImage of foundResults) {
                const dto = await BadgeStockImageMapper.toResponseDto(stockImage);
                dtos.push(dto);
            }

            return dtos;

        } catch (error) {
            console.log(error.message);
            throw new ApiError(500, error.message);
        }
    };
    //#endregion

}
