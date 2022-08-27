import {
    RedemptionDto
} from '../../domain.types/redemption.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class RedemptionMapper {

    static toDto = (redemption: any): RedemptionDto => {
        if (redemption == null) {
            return null;
        }
        const dto: RedemptionDto = {
            id: redemption.id,
            ClientId: redemption.ClientId,
            SchemeId: redemption.SchemeId,
            ParticipantId: redemption.ParticipantId,
            Name: redemption.Name,
            Description: redemption.Description,
            RedemptionDate: redemption.RedemptionDate,
            RedemptionStatus: redemption.RedemptionStatus,
            RootRuleNodeId: redemption.RootRuleNodeId,

        };
        return dto;
    };

}