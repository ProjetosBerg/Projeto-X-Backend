import { RecordTypeModel } from "@/domain/models/postgres/RecordTypesModel";

export interface RecordTypesRepositoryProtocol {
  create(
    data: RecordTypesRepositoryProtocol.CreateRecordTypesParams
  ): Promise<RecordTypeModel>;
  findByNameAndUserId(
    data: RecordTypesRepositoryProtocol.FindByNameAndUserIdParams
  ): Promise<RecordTypeModel | null>;
  findByUserId(
    data: RecordTypesRepositoryProtocol.FindByUserIdParams
  ): Promise<RecordTypeModel[]>;
}

export namespace RecordTypesRepositoryProtocol {
  export type FindByNameAndUserIdParams = {
    name: RecordTypeModel["name"];
    user_id: RecordTypeModel["user_id"];
  };

  export type CreateRecordTypesParams = {
    name: RecordTypeModel["name"];
    user_id: RecordTypeModel["user_id"];
    icone: RecordTypeModel["icone"];
  };

  export type FindByUserIdParams = {
    userId: RecordTypeModel["user_id"];
  };
}
