import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PaymentSessionDocument = PaymentSession & Document;

@Schema({ timestamps: true })
export class PaymentSession {
    @Prop({ required: true, unique: true, index: true })
    sessionId: string;

    @Prop({ required: true })
    documento: string;

    @Prop({ required: true })
    celular: string;

    @Prop({ required: true })
    valor: number;

    @Prop({ required: true })
    token: string;

    @Prop({ default: false })
    confirmed: boolean;

    @Prop({ required: true, index: true, expires: 600 }) // TTL: 10 minutos
    expiresAt: Date;
}

export const PaymentSessionSchema =
    SchemaFactory.createForClass(PaymentSession);
