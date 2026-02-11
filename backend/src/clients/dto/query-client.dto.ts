import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class QueryClientDto {
    @IsNotEmpty({ message: 'El documento es obligatorio' })
    @IsString()
    @Matches(/^[0-9]+$/, { message: 'El documento solo debe contener números' })
    documento: string;

    @IsNotEmpty({ message: 'El celular es obligatorio' })
    @IsString()
    @Matches(/^[0-9]+$/, { message: 'El celular solo debe contener números' })
    celular: string;
}
