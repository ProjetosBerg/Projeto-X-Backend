import {
  CustomFieldModel,
  Option,
} from "@/domain/models/mongo/CustomFieldModel";
import { CustomFieldsRepositoryProtocol } from "@/infra/db/interfaces/customFieldsRepositoryProtocol";
import { CustomFieldModel as CustomField } from "@/domain/entities/mongo/CustomFieldsSchema";

export class CustomFieldsRepository implements CustomFieldsRepositoryProtocol {
  async create(
    data: CustomFieldsRepositoryProtocol.CreateCustomFieldParams
  ): Promise<CustomFieldModel> {
    const customField = new CustomField({
      type: data.type,
      label: data.label,
      name: data.name,
      category_id: data.category_id,
      user_id: data.user_id,
      description: data.description,
      options: data.options,
      record_type_id: data.record_type_id,
      required: data.required ?? false,
    });

    const savedCustomField = await customField.save();
    return savedCustomField;
  }

  async findByNameAndUserId(
    data: CustomFieldsRepositoryProtocol.findByNameAndUserIdParams
  ): Promise<CustomFieldModel | null> {
    const customField = await CustomField.findOne({
      name: data.name,
      user_id: data.user_id,
    });

    if (!customField) return null;

    return customField;
  }
}
