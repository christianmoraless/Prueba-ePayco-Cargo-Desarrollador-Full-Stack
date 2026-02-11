
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum TransactionType {
    RECARGA = 'RECARGA',
    PAGO_ENVIADO = 'PAGO_ENVIADO',
    PAGO_RECIBIDO = 'PAGO_RECIBIDO',
}

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ required: true, index: true })
    userId: string; // Documento del usuario relacionado con esta transacción

    @Prop({ required: true, enum: TransactionType })
    type: TransactionType;

    @Prop({ required: true })
    amount: number;

    @Prop({ required: true })
    referenceId: string; // ID de sesión, ID de recarga, etc.

    @Prop()
    relatedUser?: string; // Nombre o documento de la contraparte

    @Prop()
    description?: string; // Descripción opcional
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
