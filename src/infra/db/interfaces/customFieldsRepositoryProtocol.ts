import { CustomFieldModel } from "@/domain/models/mongo/CustomFieldModel";

export interface CustomFieldsRepositoryProtocol {
  create(
    data: CustomFieldsRepositoryProtocol.CreateCustomFieldParams
  ): Promise<CustomFieldModel>;
  findByNameAndUserId(
    data: CustomFieldsRepositoryProtocol.findByNameAndUserIdParams
  ): Promise<CustomFieldModel | null>;
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
}
