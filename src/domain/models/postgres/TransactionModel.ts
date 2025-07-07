import { MonthlyRecordModel } from "./MonthlyRecordModel";
import { CategoryModel } from "./CategoryModel";
import { UserModel } from "./UserModel";

export type TransactionModel = {
  id?: string;
  title: string;
  description?: string;
  amount?: number;
  transaction_date: Date;
  monthly_record_id: MonthlyRecordModel["id"];
  category_id: CategoryModel["id"];
  user_id: UserModel["id"];
  created_at?: Date;
  updated_at?: Date;
};
