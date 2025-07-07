import { CategoryModel } from "./CategoryModel";
import { UserModel } from "./UserModel";
import { TransactionModel } from "./TransactionModel";

export type MonthlyRecordModel = {
  id?: string;
  title: string;
  description?: string;
  goal: string;
  initial_balance?: number;
  month: number;
  year: number;
  category_id: CategoryModel["id"];
  user_id: UserModel["id"];
  transactions?: TransactionModel[];
  created_at?: Date;
  updated_at?: Date;
};
