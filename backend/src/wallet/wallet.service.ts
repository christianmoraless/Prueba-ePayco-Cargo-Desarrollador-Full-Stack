import { Injectable } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { ClientDocument } from '../clients/schemas/client.schema';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionType } from '../transactions/schemas/transaction.schema';

@Injectable()
export class WalletService {
    constructor(
        private readonly clientsService: ClientsService,
        private readonly transactionsService: TransactionsService,
    ) { }

    async recharge(rechargeDto: RechargeWalletDto): Promise<ClientDocument> {
        // Verificar que el cliente exista y los datos coincidan
        const client = await this.clientsService.findByDocumentoAndCelular({
            documento: rechargeDto.documento,
            celular: rechargeDto.celular,
        });

        // Incrementar saldo
        const nuevoSaldo = client.saldo + rechargeDto.valor;
        const updatedClient = await this.clientsService.updateSaldo(client.documento, nuevoSaldo);

        // Registrar transacción
        await this.transactionsService.create(
            client.documento,
            TransactionType.RECARGA,
            rechargeDto.valor,
            `RECARGA-${Date.now()}`, // Reference ID simple
            undefined, // No related user
            'Recarga de billetera',
        );

        return updatedClient;
    }
}
