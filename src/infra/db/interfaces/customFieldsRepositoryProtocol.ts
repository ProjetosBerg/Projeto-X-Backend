import { CustomFieldModel } from "@/domain/models/mongo/CustomFieldModel";

export interface CustomFieldsRepositoryProtocol {
  create(
    data: CustomFieldsRepositoryProtocol.CreateCustomFieldParams
  ): Promise<CustomFieldModel>;
  findByNameAndUserId(
    data: CustomFieldsRepositoryProtocol.findByNameAndUserIdParams
  ): Promise<CustomFieldModel | null>;
  findByUserId(
    data: CustomFieldsRepositoryProtocol.findByUserIdParams
  ): Promise<CustomFieldModel[]>;
  findByIdAndUserId(
    data: CustomFieldsRepositoryProtocol.FindByIdAndUserIdParams
  ): Promise<CustomFieldModel | null>;
  update(
    data: CustomFieldsRepositoryProtocol.UpdateParams
  ): Promise<CustomFieldModel>;
}

export namespace CustomFieldsRepositoryProtocol {
  export type CreateCustomFieldParams = {
    type: CustomFieldModel["type"];
    label: CustomFieldModel["label"];
    description?: CustomFieldModel["description"];
    category_id: CustomFieldModel["category_id"];
    record_type_id: CustomFieldModel["record_type_id"];
    name: CustomFieldModel["name"];
    required: CustomFieldModel["required"];
    user_id: CustomFieldModel["user_id"];
    options?: CustomFieldModel["options"];
  };

  export type findByNameAndUserIdParams = {
    name: CustomFieldModel["name"];
    user_id: CustomFieldModel["user_id"];
  };

  export type findByUserIdParams = {
    user_id: CustomFieldModel["user_id"];
  };

  export type FindByIdAndUserIdParams = {
    id: CustomFieldModel["id"];
    user_id: CustomFieldModel["user_id"];
  };

  export type UpdateParams = {
    id: CustomFieldModel["id"];
    user_id: CustomFieldModel["user_id"];
    type?: CustomFieldModel["type"];
    label?: CustomFieldModel["label"];
    name?: CustomFieldModel["name"];
    category_id?: CustomFieldModel["category_id"];
    description?: CustomFieldModel["description"] | null;
    options?: CustomFieldModel["options"] | null;
    record_type_id?: CustomFieldModel["record_type_id"];
    required?: CustomFieldModel["required"];
  };
}
