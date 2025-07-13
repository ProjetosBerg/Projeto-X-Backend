import { TransactionModel } from "@/domain/models/postgres/TransactionModel";
export interface DeleteTransactionUseCaseProtocol {
  handle(data: DeleteTransactionUseCaseProtocol.Params): Promise<void>;
}

export namespace DeleteTransactionUseCaseProtocol {
  export type Params = {};
}
