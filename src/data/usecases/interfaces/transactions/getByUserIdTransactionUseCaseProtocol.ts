import {
  TransactionModel,
  TransactionModelMock,
} from "@/domain/models/postgres/TransactionModel";

export interface GetByUserIdTransactionUseCaseProtocol {
  handle(
    data: GetByUserIdTransactionUseCaseProtocol.Params
  ): Promise<TransactionModelMock[]>;
}

export namespace GetByUserIdTransactionUseCaseProtocol {
  export type Params = {
    userId: TransactionModel["user_id"];
    monthlyRecordId: TransactionModel["monthly_record_id"];
  };
}
