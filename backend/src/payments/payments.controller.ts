import { Controller, Post, Body, HttpCode, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RequestPaymentDto } from './dto/request-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @UseGuards(JwtAuthGuard)
    @Post('solicitarPago')
    @HttpCode(200)
    async solicitarPago(@Body() requestDto: RequestPaymentDto, @Request() req) {
        // Lógica PUSH: El usuario autenticado es el PAGADOR (quien envía el dinero)
        // El formulario contiene los datos del BENEFICIARIO (quien recibe)
        const documentoPagador = req.user.documento;

        const result = await this.paymentsService.requestPayment(requestDto, documentoPagador);
        return ApiResponseDto.ok(result, result.message);
    }

    @Post('confirmarPago')
    @HttpCode(200)
    async confirmarPago(@Body() confirmDto: ConfirmPaymentDto) {
        await this.paymentsService.confirmPayment(confirmDto);
        return ApiResponseDto.ok(null, 'Pago realizado exitosamente');
    }
}
