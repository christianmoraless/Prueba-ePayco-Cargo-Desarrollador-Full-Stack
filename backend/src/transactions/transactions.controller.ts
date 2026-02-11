import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('api/transactions')
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getHistory(@Request() req) {
        // Obtenemos el documento del usuario desde el token (req.user.documento)
        // Nota: El schema Transaction usa 'userId' que en nuestra app es el 'documento'
        const transactions = await this.transactionsService.findByUser(req.user.documento);
        return ApiResponseDto.ok(transactions, 'Historial recuperado exitosamente');
    }

    @UseGuards(JwtAuthGuard)
    @Get('recent')
    async getRecent(@Request() req) {
        const transactions = await this.transactionsService.getRecent(req.user.documento);
        return ApiResponseDto.ok(transactions, 'Transacciones recientes recuperadas');
    }
}
