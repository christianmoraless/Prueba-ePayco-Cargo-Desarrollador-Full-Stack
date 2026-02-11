import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class ConfirmPaymentDto {
    @IsNotEmpty({ message: 'El ID de sesión es obligatorio' })
    @IsString()
    sessionId: string;

    @IsNotEmpty({ message: 'El token es obligatorio' })
    @IsString()
    @Length(6, 6, { message: 'El token debe tener exactamente 6 dígitos' })
    @Matches(/^[0-9]+$/, { message: 'El token solo debe contener números' })
    token: string;
}
