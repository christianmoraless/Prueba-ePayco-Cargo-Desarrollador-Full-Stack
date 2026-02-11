import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClientDocument = Client & Document;

@Schema({ timestamps: true })
export class Client {
    @Prop({ required: true, unique: true, index: true })
    documento: string;

    @Prop({ required: true })
    nombres: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    celular: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 0 })
    saldo: number;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
