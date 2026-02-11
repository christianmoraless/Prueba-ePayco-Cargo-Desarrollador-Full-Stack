import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator';

export class CreateClientDto {
    @IsNotEmpty({ message: 'El documento es obligatorio' })
    @IsString()
    @MinLength(5, { message: 'El documento debe tener mínimo 5 caracteres' })
    @MaxLength(20, { message: 'El documento debe tener máximo 20 caracteres' })
    @Matches(/^[0-9]+$/, { message: 'El documento solo debe contener números' })
    documento: string;

    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @IsString()
    @MinLength(3, { message: 'El nombre debe tener mínimo 3 caracteres' })
    @MaxLength(100, { message: 'El nombre debe tener máximo 100 caracteres' })
    nombres: string;

    @IsNotEmpty({ message: 'El email es obligatorio' })
    @IsEmail({}, { message: 'El email no es válido' })
    email: string;

    @IsNotEmpty({ message: 'El celular es obligatorio' })
    @IsString()
    @MinLength(7, { message: 'El celular debe tener mínimo 7 dígitos' })
    @MaxLength(15, { message: 'El celular debe tener máximo 15 dígitos' })
    @Matches(/^[0-9]+$/, { message: 'El celular solo debe contener números' })
    celular: string;

    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @IsString()
    @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
    @MaxLength(50, { message: 'La contraseña debe tener máximo 50 caracteres' })
    password: string;
}
