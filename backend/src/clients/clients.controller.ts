import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientWalletDto } from './dto/create-client-wallet.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('api')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) { }

    @Post('registroCliente')
    async registroCliente(@Body() createClientDto: CreateClientWalletDto) {
        const client = await this.clientsService.createWallet(createClientDto);
        return ApiResponseDto.created(
            {
                _id: client._id,
                documento: client.documento,
                nombres: client.nombres,
                email: client.email,
                celular: client.celular,
                saldo: client.saldo,
            },
            'Cliente registrado exitosamente',
        );
    }

    @Post('consultarSaldo')
    @HttpCode(200)
    async consultarSaldo(@Body() queryClientDto: QueryClientDto) {
        const client =
            await this.clientsService.findByDocumentoAndCelular(queryClientDto);
        return ApiResponseDto.ok(
            {
                documento: client.documento,
                nombres: client.nombres,
                saldo: client.saldo,
            },
            'Saldo consultado exitosamente',
        );
    }
}
