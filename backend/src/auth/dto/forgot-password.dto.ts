import { IsNotEmpty, IsEmail } from 'class-validator';

export class ForgotPasswordDto {
    @IsNotEmpty({ message: 'El email es obligatorio' })
    @IsEmail({}, { message: 'El email no es válido' })
    email: string;
}
