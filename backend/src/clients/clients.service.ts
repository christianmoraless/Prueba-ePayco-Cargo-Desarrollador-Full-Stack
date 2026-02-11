import {
    Injectable,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Client, ClientDocument } from './schemas/client.schema';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateClientWalletDto } from './dto/create-client-wallet.dto';
import { QueryClientDto } from './dto/query-client.dto';

@Injectable()
export class ClientsService {
    constructor(
        @InjectModel(Client.name)
        private clientModel: Model<ClientDocument>,
    ) { }

    // Registro interno de clientes (sin password, desde el dashboard)
    async createWallet(dto: CreateClientWalletDto): Promise<ClientDocument> {
        const existing = await this.clientModel.findOne({ documento: dto.documento });
        if (existing) {
            throw new ConflictException(
                `Ya existe un cliente con el documento ${dto.documento}`,
            );
        }

        const existingEmail = await this.clientModel.findOne({ email: dto.email });
        if (existingEmail) {
            throw new ConflictException(
                `Ya existe un cliente con el email ${dto.email}`,
            );
        }

        // Generar password temporal (el usuario puede usar forgot-password después)
        const salt = await bcrypt.genSalt(10);
        const tempPassword = await bcrypt.hash(dto.documento, salt);

        const client = new this.clientModel({
            ...dto,
            password: tempPassword,
            saldo: 0,
        });

        return client.save();
    }

    // Registro con password (usado por AuthService)
    async create(createClientDto: CreateClientDto): Promise<ClientDocument> {
        const existing = await this.clientModel.findOne({ documento: createClientDto.documento });
        if (existing) {
            throw new ConflictException(
                `Ya existe un cliente con el documento ${createClientDto.documento}`,
            );
        }

        const existingEmail = await this.clientModel.findOne({ email: createClientDto.email });
        if (existingEmail) {
            throw new ConflictException(
                `Ya existe un cliente con el email ${createClientDto.email}`,
            );
        }

        const client = new this.clientModel({
            ...createClientDto,
            saldo: 0,
        });

        return client.save();
    }

    async findByDocumentoAndCelular(
        queryDto: QueryClientDto,
    ): Promise<ClientDocument> {
        const client = await this.clientModel.findOne({
            documento: queryDto.documento,
            celular: queryDto.celular,
        });

        if (!client) {
            throw new NotFoundException(
                'No se encontró un cliente con los datos proporcionados',
            );
        }

        return client;
    }

    async findByDocumento(documento: string): Promise<ClientDocument> {
        const client = await this.clientModel.findOne({ documento });

        if (!client) {
            throw new NotFoundException(
                `No se encontró un cliente con el documento ${documento}`,
            );
        }

        return client;
    }

    async updateSaldo(
        documento: string,
        nuevoSaldo: number,
    ): Promise<ClientDocument> {
        const client = await this.clientModel.findOneAndUpdate(
            { documento },
            { saldo: nuevoSaldo },
            { returnDocument: 'after' },
        );

        if (!client) {
            throw new NotFoundException(
                `No se encontró un cliente con el documento ${documento}`,
            );
        }

        return client;
    }
}
