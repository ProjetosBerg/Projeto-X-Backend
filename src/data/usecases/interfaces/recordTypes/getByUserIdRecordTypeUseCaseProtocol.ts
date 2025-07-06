import { RecordTypeModel } from "@/domain/models/postgres/RecordTypesModel";

export interface GetByUserIdRecordTypeUseCaseProtocol {
  handle(
    data: GetByUserIdRecordTypeUseCaseProtocol.Params
  ): Promise<RecordTypeModel[]>;
}

export namespace GetByUserIdRecordTypeUseCaseProtocol {
  export type Params = {
    userId: RecordTypeModel["user_id"];
  };
}
