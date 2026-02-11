import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import {
    PaymentSession,
    PaymentSessionSchema,
} from './schemas/payment-session.schema';

import { ClientsModule } from '../clients/clients.module';
import { AuthModule } from '../auth/auth.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: PaymentSession.name, schema: PaymentSessionSchema },
        ]),
        ClientsModule,
        AuthModule,
        TransactionsModule,
    ],
    controllers: [PaymentsController],
    providers: [PaymentsService],
})
export class PaymentsModule { }
