import { IsNotEmpty, IsString, IsNumber, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class RequestPaymentDto {
    @IsNotEmpty({ message: 'El documento es obligatorio' })
    @IsString()
    @Matches(/^[0-9]+$/, { message: 'El documento solo debe contener números' })
    documento: string;

    @IsNotEmpty({ message: 'El celular es obligatorio' })
    @IsString()
    @Matches(/^[0-9]+$/, { message: 'El celular solo debe contener números' })
    celular: string;

    @IsNotEmpty({ message: 'El valor es obligatorio' })
    @Type(() => Number)
    @IsNumber({}, { message: 'El valor debe ser un número' })
    @Min(100, { message: 'El monto mínimo de pago es $100' })
    valor: number;
}
