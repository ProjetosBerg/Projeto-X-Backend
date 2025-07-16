import {
  TransactionModel,
  TransactionModelMock,
} from "@/domain/models/postgres/TransactionModel";

export interface GetByIdTransactionUseCaseProtocol {
  handle(
    data: GetByIdTransactionUseCaseProtocol.Params
  ): Promise<TransactionModelMock>;
}

export namespace GetByIdTransactionUseCaseProtocol {
  export type Params = {
    transactionId: TransactionModel["id"];
    userId: TransactionModel["user_id"];
  };
}
