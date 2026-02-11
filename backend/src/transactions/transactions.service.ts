import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction, TransactionDocument, TransactionType } from './schemas/transaction.schema';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    ) { }

    async create(
        userId: string,
        type: TransactionType,
        amount: number,
        referenceId: string,
        relatedUser?: string,
        description?: string,
    ): Promise<TransactionDocument> {
        const transaction = new this.transactionModel({
            userId,
            type,
            amount,
            referenceId,
            relatedUser,
            description,
        });
        return transaction.save();
    }

    async findByUser(userId: string): Promise<TransactionDocument[]> {
        return this.transactionModel
            .find({ userId })
            .sort({ createdAt: -1 }) // Más recientes primero
            .exec();
    }

    async getRecent(userId: string, limit: number = 5): Promise<TransactionDocument[]> {
        return this.transactionModel
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .exec();
    }
}
