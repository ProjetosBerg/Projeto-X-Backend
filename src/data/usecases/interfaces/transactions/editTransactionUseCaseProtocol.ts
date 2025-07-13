import { TransactionModel } from "@/domain/models/postgres/TransactionModel";

export interface EditTransactionUseCaseProtocol {
  handle(data: EditTransactionUseCaseProtocol.Params): Promise<any>;
}

export namespace EditTransactionUseCaseProtocol {
  export type Params = {};
}
