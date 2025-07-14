import { Repository, getRepository } from "typeorm";
import { Transaction } from "@/domain/entities/postgres/Transaction";
import {
  TransactionModel,
  TransactionModelMock,
} from "@/domain/models/postgres/TransactionModel";
import { User } from "@/domain/entities/postgres/User";
import { Category } from "@/domain/entities/postgres/Category";
import { MonthlyRecord } from "@/domain/entities/postgres/MonthlyRecord";
import { TransactionRepositoryProtocol } from "../interfaces/transactionRepositoryProtocol";

export class TransactionRepository implements TransactionRepositoryProtocol {
  private repository: Repository<Transaction>;

  constructor() {
    this.repository = getRepository(Transaction);
  }

  async create(
    data: TransactionRepositoryProtocol.CreateTransactionParams
  ): Promise<TransactionModelMock> {
    const transaction = this.repository.create({
      title: data.title,
      description: data.description,
      amount: data.amount,
      transaction_date: data.transaction_date,
      monthly_record: { id: data.monthly_record_id } as MonthlyRecord,
      category: { id: data.category_id } as Category,
      user: { id: data.user_id } as User,
    });

    const savedTransaction = await this.repository.save(transaction);
    return savedTransaction;
  }
}
