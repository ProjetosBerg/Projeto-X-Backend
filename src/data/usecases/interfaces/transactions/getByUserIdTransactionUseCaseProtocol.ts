import {
  TransactionModel,
  TransactionModelMock,
} from "@/domain/models/postgres/TransactionModel";
import { CustomFieldValueWithMetadata } from "../../transactions/utils/customFieldValueWithMetadata";

export interface GetByUserIdTransactionUseCaseProtocol {
  handle(data: GetByUserIdTransactionUseCaseProtocol.Params): Promise<
    Array<{
      transaction: TransactionModelMock;
      customFields?: CustomFieldValueWithMetadata[];
      recordTypeId?: number;
    }>
  >;
}

export namespace GetByUserIdTransactionUseCaseProtocol {
  export type Params = {
    userId: TransactionModel["user_id"];
    monthlyRecordId: TransactionModel["monthly_record_id"];
  };
}
