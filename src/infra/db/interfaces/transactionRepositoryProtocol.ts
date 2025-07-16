import {
  TransactionModel,
  TransactionModelMock,
} from "@/domain/models/postgres/TransactionModel";

export interface TransactionRepositoryProtocol {
  create(
    data: TransactionRepositoryProtocol.CreateTransactionParams
  ): Promise<TransactionModelMock>;
  findByUserIdAndMonthlyRecordId(
    data: TransactionRepositoryProtocol.FindByUserAndMonthlyRecordIdParams
  ): Promise<TransactionModelMock[]>;
  findByIdAndUserId(
    data: TransactionRepositoryProtocol.FindByIdAndUserIdParams
  ): Promise<TransactionModelMock | null>;
}

export namespace TransactionRepositoryProtocol {
  export type CreateTransactionParams = {
    title: TransactionModel["title"];
    description?: TransactionModel["description"];
    amount?: TransactionModel["amount"];
    transaction_date: TransactionModel["transaction_date"];
    monthly_record_id: TransactionModel["monthly_record_id"];
    category_id: TransactionModel["category_id"];
    user_id: TransactionModel["user_id"];
  };
  export type FindByUserAndMonthlyRecordIdParams = {
    userId: TransactionModel["user_id"];
    monthlyRecordId: TransactionModel["monthly_record_id"];
  };

  export type FindByIdAndUserIdParams = {
    id: TransactionModel["id"];
    userId: TransactionModel["user_id"];
  };
}
