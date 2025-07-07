import { RecordTypeModel } from "./RecordTypesModel";
import { UserModel } from "./UserModel";
import { MonthlyRecordModel } from "./MonthlyRecordModel";
import { TransactionModel } from "./TransactionModel";

export type CategoryModel = {
  id?: string;
  name: string;
  description?: string;
  type: string;
  record_type_id: RecordTypeModel["id"];
  user_id: UserModel["id"];
  monthly_records?: MonthlyRecordModel[];
  transactions?: TransactionModel[];
  created_at?: Date;
  updated_at?: Date;
};
