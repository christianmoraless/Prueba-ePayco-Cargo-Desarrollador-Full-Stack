import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
    @IsNotEmpty({ message: 'El email es obligatorio' })
    @IsEmail({}, { message: 'El email no es válido' })
    email: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
    password: string;
}
