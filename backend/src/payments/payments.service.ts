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
import { RequestPaymentDto } from './dto/request-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(
        @InjectModel(PaymentSession.name)
        private paymentSessionModel: Model<PaymentSessionDocument>,
        private readonly clientsService: ClientsService,
        private readonly mailService: MailService,
    ) { }

    /**
     * Genera un token OTP de 6 dígitos
     */
    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Solicitar pago: verifica saldo, genera token OTP, crea sesión
     */
    async requestPayment(
        requestDto: RequestPaymentDto,
    ): Promise<{ sessionId: string; message: string }> {
        // 1. Verificar que el cliente exista y los datos coincidan
        const client = await this.clientsService.findByDocumentoAndCelular({
            documento: requestDto.documento,
            celular: requestDto.celular,
        });

        // 2. Verificar que tenga saldo suficiente
        if (client.saldo < requestDto.valor) {
            throw new BadRequestException(
                `Saldo insuficiente. Saldo actual: $${client.saldo.toLocaleString()}, Monto requerido: $${requestDto.valor.toLocaleString()}`,
            );
        }

        // 3. Generar token OTP y session ID
        const token = this.generateOtp();
        const sessionId = uuidv4();

        // 4. Crear sesión de pago en la base de datos
        const session = new this.paymentSessionModel({
            sessionId,
            documento: requestDto.documento,
            celular: requestDto.celular,
            valor: requestDto.valor,
            token,
            confirmed: false,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutos
        });

        await session.save();

        // 5. Enviar token por email
        await this.mailService.sendOtpToken(client.email, token, client.nombres);

        return {
            sessionId,
            message: `Token de confirmación enviado al email ${client.email}`,
        };
    }

    /**
     * Confirmar pago: valida token + sessionId, descuenta saldo
     */
    async confirmPayment(confirmDto: ConfirmPaymentDto): Promise<void> {
        // 1. Buscar la sesión de pago
        const session = await this.paymentSessionModel.findOne({
            sessionId: confirmDto.sessionId,
        });

        if (!session) {
            throw new NotFoundException(
                'Sesión de pago no encontrada o expirada. Solicite un nuevo pago.',
            );
        }

        // 2. Verificar que no esté ya confirmada
        if (session.confirmed) {
            throw new BadRequestException('Esta sesión de pago ya fue confirmada');
        }

        // 3. Validar el token
        if (session.token !== confirmDto.token) {
            throw new BadRequestException(
                'Token de confirmación incorrecto. Verifique e intente nuevamente.',
            );
        }

        // 4. Verificar que no haya expirado
        if (new Date() > session.expiresAt) {
            throw new BadRequestException(
                'El token ha expirado. Solicite un nuevo pago.',
            );
        }

        // 5. Obtener el cliente y verificar saldo nuevamente
        const client = await this.clientsService.findByDocumento(session.documento);

        if (client.saldo < session.valor) {
            throw new BadRequestException(
                'Saldo insuficiente para completar la transacción',
            );
        }

        // 6. Descontar el saldo
        const nuevoSaldo = client.saldo - session.valor;
        await this.clientsService.updateSaldo(client.documento, nuevoSaldo);

        // 7. Marcar sesión como confirmada
        session.confirmed = true;
        await session.save();
    }
}
