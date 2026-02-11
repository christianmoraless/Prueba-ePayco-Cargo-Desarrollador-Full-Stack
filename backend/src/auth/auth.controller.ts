import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateClientDto } from '../clients/dto/create-client.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiResponseDto } from '../common/dto/api-response.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: CreateClientDto) {
        const result = await this.authService.register(dto);
        return ApiResponseDto.created(result, 'Registro exitoso');
    }

    @Post('login')
    async login(@Body() dto: LoginDto) {
        const result = await this.authService.login(dto);
        return ApiResponseDto.ok(result, 'Inicio de sesión exitoso');
    }

    @Post('forgot-password')
    async forgotPassword(@Body() dto: ForgotPasswordDto) {
        const result = await this.authService.forgotPassword(dto);
        return ApiResponseDto.ok(null, result.message);
    }

    @Post('reset-password')
    async resetPassword(@Body() dto: ResetPasswordDto) {
        const result = await this.authService.resetPassword(dto);
        return ApiResponseDto.ok(null, result.message);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        const cliente = await this.authService.getProfile(req.user.userId);
        return ApiResponseDto.ok(cliente, 'Perfil obtenido exitosamente');
    }
}
