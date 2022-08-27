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
            ClientName: client.ClientName,
            ClientCode: client.ClientCode,
            Phone: client.Phone,
            Email: client.Email,

        };
        return dto;
    };

}