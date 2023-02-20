import {
    ClientDto
} from '../../domain.types/client.domain.types';

///////////////////////////////////////////////////////////////////////////////////

export class ClientMapper {

    static toDto = (client: any): ClientDto => {
        if (client == null) {
            return null;
        }
        const dto: ClientDto = {
            id: client.id,
            Name: client.Name,
            Code: client.Code,
            Phone: client.Phone,
            Email: client.Email,

        };
        return dto;
    };

}