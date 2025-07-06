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

  findByIdRecordType(
    data: RecordTypesRepositoryProtocol.FindByIdRecordTypeParams
  ): Promise<RecordTypeModel | null>;
  updateRecordTypes(
    data: RecordTypesRepositoryProtocol.UpdateRecordTypes
  ): Promise<RecordTypeModel>;
}

export namespace RecordTypesRepositoryProtocol {
  export type FindByNameAndUserIdParams = {
    name: RecordTypeModel["name"];
    userId: RecordTypeModel["user_id"];
  };

  export type CreateRecordTypesParams = {
    name: RecordTypeModel["name"];
    userId: RecordTypeModel["user_id"];
    icone: RecordTypeModel["icone"];
  };

  export type FindByUserIdParams = {
    userId: RecordTypeModel["user_id"];
  };

  export type FindByIdRecordTypeParams = {
    id: RecordTypeModel["id"];
    userId: RecordTypeModel["user_id"];
  };

  export type UpdateRecordTypes = {
    id: RecordTypeModel["id"];
    userId: RecordTypeModel["user_id"];
    name: RecordTypeModel["name"];
    icone: RecordTypeModel["icone"];
  };
}
