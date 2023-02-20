import {
    ClientDto
} from '../../domain.types/api.client.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class ApiClientMapper {

    static toDto = (apiClient: any): ClientDto => {
        if (apiClient == null) {
            return null;
        }
        const dto: ClientDto = {
            id           : apiClient.id,
            Name   : apiClient.Name,
            Code   : apiClient.Code,
            IsPrivileged : apiClient.IsPrivileged,
            CountryCode  : apiClient.CountryCode,
            Phone        : apiClient.Phone,
            Email        : apiClient.Email,
            ValidFrom    : apiClient.ValidFrom,
            ValidTill    : apiClient.ValidTill,
            IsActive     : apiClient.IsActive
        };
        return dto;
    };

}
