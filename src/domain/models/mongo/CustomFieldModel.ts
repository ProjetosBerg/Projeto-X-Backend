import { CustomField } from "@/domain/entities/mongo/CustomFieldsSchema";
import { CategoryModel } from "../postgres/CategoryModel";
import { RecordTypeModel } from "../postgres/RecordTypesModel";
import { UserModel } from "../postgres/UserModel";

export type CustomFieldModel = {
  id?: CustomField["id"];
  type: CustomField["type"];
  label: CustomField["label"];
  description?: CustomField["description"];
  options?: CustomField["options"];
  category_id: CategoryModel["id"];
  record_type_id: RecordTypeModel["id"];
  name: string;
  required: boolean;
  user_id: UserModel["id"];
  created_at?: Date;
  updated_at?: Date;
};
