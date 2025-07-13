import { TransactionModel } from "@/domain/models/postgres/TransactionModel";

export interface GetByIdTransactionUseCaseProtocol {
  handle(data: GetByIdTransactionUseCaseProtocol.Params): Promise<any>;
}

export namespace GetByIdTransactionUseCaseProtocol {
  export type Params = {};
}
