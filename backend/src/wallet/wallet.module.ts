import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { ClientsModule } from '../clients/clients.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
    imports: [ClientsModule, TransactionsModule],
    controllers: [WalletController],
    providers: [WalletService],
})
export class WalletModule { }
