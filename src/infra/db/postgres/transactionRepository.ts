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

  async findByUserIdAndMonthlyRecordId(
    data: TransactionRepositoryProtocol.FindByUserAndMonthlyRecordIdParams
  ): Promise<TransactionModelMock[]> {
    const transactions = await this.repository.find({
      where: {
        user: { id: data.userId },
        monthly_record: { id: data.monthlyRecordId },
      },
      relations: ["user", "category", "monthly_record"],
    });

    return transactions.map((transaction) => ({
      id: transaction.id,
      title: transaction.title,
      description: transaction?.description,
      amount: transaction?.amount,
      transaction_date: transaction.transaction_date,
      monthly_record_id: transaction.monthly_record.id,
      category_id: transaction.category.id,
      user_id: transaction.user.id,
      created_at: transaction.created_at,
      updated_at: transaction.updated_at,
    }));
  }
  async findByIdAndUserId(
    data: TransactionRepositoryProtocol.FindByIdAndUserIdParams
  ): Promise<TransactionModelMock | null> {
    const transaction = await this.repository.findOne({
      where: {
        id: data.id,
        user: { id: data.userId },
      },
      relations: ["user", "category", "monthly_record"],
    });

    if (!transaction) return null;

    return {
      ...transaction,
      monthly_record_id: transaction?.monthly_record!.id,
    };
  }
}
