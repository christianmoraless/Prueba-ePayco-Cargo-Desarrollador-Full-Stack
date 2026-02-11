import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { RequestPaymentDto } from './dto/request-payment.dto';
import { ConfirmPaymentDto } from './dto/confirm-payment.dto';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('api')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) { }

    @Post('solicitarPago')
    @HttpCode(200)
    async solicitarPago(@Body() requestDto: RequestPaymentDto) {
        const result = await this.paymentsService.requestPayment(requestDto);
        return ApiResponseDto.ok(result, result.message);
    }

    @Post('confirmarPago')
    @HttpCode(200)
    async confirmarPago(@Body() confirmDto: ConfirmPaymentDto) {
        await this.paymentsService.confirmPayment(confirmDto);
        return ApiResponseDto.ok(null, 'Pago confirmado exitosamente');
    }
}
