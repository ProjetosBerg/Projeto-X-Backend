import { TransactionModel } from "@/domain/models/postgres/TransactionModel";

export interface CreateTransactionUseCaseProtocol {
  handle(data: CreateTransactionUseCaseProtocol.Params): Promise<any>;
}

export namespace CreateTransactionUseCaseProtocol {
  export type Params = {};
}
