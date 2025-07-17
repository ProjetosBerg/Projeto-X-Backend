import {
  TransactionModel,
  TransactionModelMock,
} from "@/domain/models/postgres/TransactionModel";

export interface EditTransactionUseCaseProtocol {
  handle(
    data: EditTransactionUseCaseProtocol.Params
  ): Promise<TransactionModelMock>;
}

export namespace EditTransactionUseCaseProtocol {
  export type Params = {
    transactionId: TransactionModel["id"];
    userId: TransactionModel["user_id"];
    title?: TransactionModel["title"];
    description?: TransactionModel["description"];
    amount?: TransactionModel["amount"];
    transactionDate?: TransactionModel["transaction_date"];
    monthlyRecordId?: TransactionModel["monthly_record_id"];
    categoryId?: TransactionModel["category_id"];
  };
}
