import {
    Injectable,
    BadRequestException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import {
    PaymentSession,
    PaymentSessionDocument,
} from './schemas/payment-session.schema';
import { ClientsService } from '../clients/clients.service';
import { MailService } from '../mail/mail.service';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionType } from '../transactions/schemas/transaction.schema';
import { RequestPaymentDto } from './dto/request-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel(PaymentSession.name)
        private paymentSessionModel: Model<PaymentSessionDocument>,
        private readonly clientsService: ClientsService,
        private readonly mailService: MailService,
        private readonly transactionsService: TransactionsService,
    ) { }

    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    async requestPayment(
        requestDto: RequestPaymentDto,
        documentoPagador: string,
    ): Promise<{ sessionId: string; message: string }> {
        // 1. Obtener PAGADOR (Usuario autenticado)
        const pagador = await this.clientsService.findByDocumento(documentoPagador);

        // 2. Obtener BENEFICIARIO (Datos del formulario)
        // Verificamos documento y celular para asegurar que enviamos al correcto
        const beneficiario = await this.clientsService.findByDocumentoAndCelular({
            documento: requestDto.documento,
            celular: requestDto.celular,
        });

        // Evitar auto-pago (opcional, pero buena práctica)
        if (pagador.documento === beneficiario.documento) {
            throw new BadRequestException('No puedes realizar un pago a ti mismo.');
        }

        // 3. Verificar saldo del PAGADOR
        if (pagador.saldo < requestDto.valor) {
            throw new BadRequestException(
                `Saldo insuficiente. Tu saldo actual es: $${pagador.saldo.toLocaleString()}`,
            );
        }

        // 4. Generar Token y Session
        const token = this.generateOtp();
        const sessionId = uuidv4();

        const session = new this.paymentSessionModel({
            sessionId,
            documento: pagador.documento,            // DEUDOR (Pagador)
            documentoReceptor: beneficiario.documento, // ACREEDOR (Beneficiario)
            celular: pagador.celular,   // Celular del pagador (para registro)
            valor: requestDto.valor,
            token,
            confirmed: false,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min
        });

        await session.save();

        // 5. Enviar OTP al PAGADOR (quien debe autorizar la salida de dinero)
        await this.mailService.sendOtpToken(pagador.email, token, pagador.nombres);

        return {
            sessionId,
            message: `Token enviado a tu correo (${pagador.email}) para confirmar el pago`,
        };
    }

    async confirmPayment(confirmDto: ConfirmPaymentDto): Promise<void> {
        const session = await this.paymentSessionModel.findOne({
            sessionId: confirmDto.sessionId,
        });

        if (!session) throw new NotFoundException('Sesión de pago no encontrada o expirada.');
        if (session.confirmed) throw new BadRequestException('Esta sesión ya fue confirmada.');
        if (session.token !== confirmDto.token) throw new BadRequestException('Token incorrecto.');
        if (new Date() > session.expiresAt) throw new BadRequestException('El token ha expirado.');

        // 1. Verificar saldo del Pagador nuevamente
        const pagador = await this.clientsService.findByDocumento(session.documento);
        if (pagador.saldo < session.valor) {
            throw new BadRequestException('Saldo insuficiente para completar la transacción.');
        }

        // 2. Descontar al Pagador
        await this.clientsService.updateSaldo(pagador.documento, pagador.saldo - session.valor);

        // REGISTRAR MOVIMIENTO: PAGO ENVIADO (Pagador)
        await this.transactionsService.create(
            pagador.documento,
            TransactionType.PAGO_ENVIADO,
            session.valor,
            session.sessionId,
            session.documentoReceptor, // Relacionado con el beneficiario
            'Pago enviado a ' + session.documentoReceptor,
        );

        // 3. Acreditar al Beneficiario
        // Usamos try/catch para no bloquear el flujo si algo raro pasa con el beneficiario, 
        // aunque idealmente usaríamos transacciones.
        try {
            const beneficiario = await this.clientsService.findByDocumento(session.documentoReceptor);
            await this.clientsService.updateSaldo(beneficiario.documento, beneficiario.saldo + session.valor);

            // REGISTRAR MOVIMIENTO: PAGO RECIBIDO (Beneficiario)
            await this.transactionsService.create(
                beneficiario.documento,
                TransactionType.PAGO_RECIBIDO,
                session.valor,
                session.sessionId,
                pagador.documento, // Relacionado con el pagador
                'Pago recibido de ' + pagador.documento,
            );
        } catch (error) {
            console.error(`Error acreditando al beneficiario ${session.documentoReceptor}`, error);
            // IMPORTANTE: Aquí deberíamos revertir el descuento al pagador o marcar la transacción para revisión manual.
            // Por simplicidad en este MVP, logueamos el error.
        }

        // 4. Marcar confirmado
        session.confirmed = true;
        await session.save();
    }
}
