import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { AuthModule } from '../auth/auth.module'; // Para JwtAuthGuard

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
        AuthModule,
    ],
    controllers: [TransactionsController],
    providers: [TransactionsService],
    exports: [TransactionsService], // Exportamos para usar en Wallet y Payments
})
export class TransactionsModule { }
