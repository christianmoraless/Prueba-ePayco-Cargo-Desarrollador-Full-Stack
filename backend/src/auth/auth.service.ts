import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
    BadRequestException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Client, ClientDocument } from '../clients/schemas/client.schema';
import { CreateClientDto } from '../clients/dto/create-client.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectModel(Client.name) private clientModel: Model<ClientDocument>,
        private jwtService: JwtService,
        private mailService: MailService,
    ) { }

    // ── Registro ──
    async register(dto: CreateClientDto) {
        // Verificar documento duplicado
        const existingDoc = await this.clientModel.findOne({ documento: dto.documento });
        if (existingDoc) {
            throw new ConflictException(`Ya existe un cliente con el documento ${dto.documento}`);
        }

        // Verificar email duplicado
        const existingEmail = await this.clientModel.findOne({ email: dto.email });
        if (existingEmail) {
            throw new ConflictException(`Ya existe un cliente con el email ${dto.email}`);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.password, salt);

        const client = new this.clientModel({
            ...dto,
            password: hashedPassword,
            saldo: 0,
        });

        const saved = await client.save();
        const token = this.generateToken(saved);

        return {
            token,
            cliente: this.sanitizeClient(saved),
        };
    }

    // ── Login ──
    async login(dto: LoginDto) {
        const client = await this.clientModel.findOne({ email: dto.email });
        if (!client) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const isPasswordValid = await bcrypt.compare(dto.password, client.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const token = this.generateToken(client);

        return {
            token,
            cliente: this.sanitizeClient(client),
        };
    }

    // ── Forgot Password ──
    async forgotPassword(dto: ForgotPasswordDto) {
        const client = await this.clientModel.findOne({ email: dto.email });
        if (!client) {
            // No revelar si el email existe o no (seguridad)
            return { message: 'Si el email está registrado, recibirás instrucciones para restablecer tu contraseña' };
        }

        // Generar token de reset (válido por 30 min)
        const resetToken = this.jwtService.sign(
            { sub: client._id, email: client.email, type: 'reset' },
            { expiresIn: '30m' },
        );

        // Log del token (en producción se enviaría por email)
        this.logger.log('══════════════════════════════════════════');
        this.logger.log(`📧 RESET PASSWORD para: ${client.email}`);
        this.logger.log(`🔑 Token: ${resetToken}`);
        this.logger.log('══════════════════════════════════════════');

        return { message: 'Si el email está registrado, recibirás instrucciones para restablecer tu contraseña' };
    }

    // ── Reset Password ──
    async resetPassword(dto: ResetPasswordDto) {
        try {
            const payload = this.jwtService.verify(dto.token);

            if (payload.type !== 'reset') {
                throw new BadRequestException('Token inválido');
            }

            const client = await this.clientModel.findById(payload.sub);
            if (!client) {
                throw new NotFoundException('Cliente no encontrado');
            }

            const salt = await bcrypt.genSalt(10);
            client.password = await bcrypt.hash(dto.newPassword, salt);
            await client.save();

            return { message: 'Contraseña restablecida exitosamente' };
        } catch (error) {
            if (error instanceof BadRequestException || error instanceof NotFoundException) {
                throw error;
            }
            throw new BadRequestException('Token inválido o expirado');
        }
    }

    // ── Obtener perfil (ruta protegida) ──
    async getProfile(userId: string) {
        const client = await this.clientModel.findById(userId);
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }
        return this.sanitizeClient(client);
    }

    // ── Helpers ──
    private generateToken(client: ClientDocument): string {
        return this.jwtService.sign({
            sub: client._id,
            email: client.email,
            documento: client.documento,
        });
    }

    private sanitizeClient(client: ClientDocument) {
        return {
            _id: client._id,
            documento: client.documento,
            nombres: client.nombres,
            email: client.email,
            celular: client.celular,
            saldo: client.saldo,
        };
    }
}
