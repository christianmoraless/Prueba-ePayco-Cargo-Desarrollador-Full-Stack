import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { RechargeWalletDto } from './dto/recharge-wallet.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('api')
export class WalletController {
    constructor(private readonly walletService: WalletService) { }

    @Post('recargarBilletera')
    @HttpCode(200)
    async recargarBilletera(@Body() rechargeDto: RechargeWalletDto) {
        const client = await this.walletService.recharge(rechargeDto);
        return ApiResponseDto.ok(
            {
                _id: client._id,
                documento: client.documento,
                nombres: client.nombres,
                email: client.email,
                celular: client.celular,
                saldo: client.saldo,
            },
            `Recarga de $${rechargeDto.valor.toLocaleString()} exitosa. Nuevo saldo: $${client.saldo.toLocaleString()}`,
        );
    }
}
