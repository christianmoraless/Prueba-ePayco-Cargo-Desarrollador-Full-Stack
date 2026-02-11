import { Injectable } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { ClientDocument } from '../clients/schemas/client.schema';

@Injectable()
export class WalletService {
    constructor(private readonly clientsService: ClientsService) { }

    async recharge(rechargeDto: RechargeWalletDto): Promise<ClientDocument> {
        // Verificar que el cliente exista y los datos coincidan
        const client = await this.clientsService.findByDocumentoAndCelular({
            documento: rechargeDto.documento,
            celular: rechargeDto.celular,
        });

        // Incrementar saldo
        const nuevoSaldo = client.saldo + rechargeDto.valor;
        return this.clientsService.updateSaldo(client.documento, nuevoSaldo);
    }
}
