import { RecordTypeModel } from "@/domain/models/postgres/RecordTypesModel";

export interface RecordTypesRepositoryProtocol {
  create(
    data: RecordTypesRepositoryProtocol.CreateRecordTypes
  ): Promise<RecordTypeModel>;
  findByNameAndUserId(
    data: RecordTypesRepositoryProtocol.FindByNameAndUserIdParams
  ): Promise<RecordTypeModel | null>;
}

export namespace RecordTypesRepositoryProtocol {
  export type FindByNameAndUserIdParams = {
    name: RecordTypeModel["name"];
    user_id: RecordTypeModel["user_id"];
  };

  export type CreateRecordTypes = {
    name: RecordTypeModel["name"];
    user_id: RecordTypeModel["user_id"];
    icone: RecordTypeModel["icone"];
  };
}
