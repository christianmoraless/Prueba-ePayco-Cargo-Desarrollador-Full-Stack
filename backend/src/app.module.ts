import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from './clients/clients.module';
import { WalletModule } from './wallet/wallet.module';
import { PaymentsModule } from './payments/payments.module';
import { TransactionsModule } from './transactions/transactions.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Cargar variables de entorno
    ConfigModule.forRoot({ isGlobal: true }),

    // Conexión a MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/epayco-wallet'),

    // Módulos de la aplicación
    MailModule,
    AuthModule,
    ClientsModule,
    WalletModule,
    PaymentsModule,
    TransactionsModule,
  ],
})
export class AppModule { }

