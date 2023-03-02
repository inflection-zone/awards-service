import { Client } from '../../models/client/client.model';
import {
    ClientResponseDto,
    ClientSearchResponseDto,
    ClientApiKeyResponseDto,
} from '../../../domain.types/client/client.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class ClientMapper {

    static toResponseDto = (client: Client): ClientResponseDto => {
        if (client == null) {
            return null;
        }
        const now = new Date();
        const dto: ClientResponseDto = {
            id           : client.id,
            Name         : client.Name,
            Code         : client.Code,
            IsPrivileged : client.IsPrivileged,
            CountryCode  : client.CountryCode,
            Phone        : client.Phone,
            Email        : client.Email,
            ValidFrom    : client.ValidFrom,
            ValidTill    : client.ValidTill,
            IsActive     : client.ValidFrom <= now && now <= client.ValidTill,
        };
        return dto;
    };

    static toSearchResponseDto = (client: Client): ClientSearchResponseDto => {
        if (client == null) {
            return null;
        }
        const now = new Date();
        const dto: ClientSearchResponseDto = {
            id           : client.id,
            Name         : client.Name,
            Code         : client.Code,
            IsPrivileged : client.IsPrivileged,
            CountryCode  : client.CountryCode,
            Phone        : client.Phone,
            Email        : client.Email,
            IsActive     : client.ValidFrom <= now && now <= client.ValidTill,
        };
        return dto;
    };

    static toClientSecretsResponseDto = (client: Client): ClientApiKeyResponseDto => {
        if (client == null){
            return null;
        }
        const dto: ClientApiKeyResponseDto = {
            id        : client.id,
            Name      : client.Name,
            Code      : client.Code,
            ApiKey    : client.ApiKey,
            ValidFrom : client.ValidFrom,
            ValidTill : client.ValidTill,
        };
        return dto;
    };

}
