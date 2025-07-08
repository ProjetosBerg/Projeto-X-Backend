import { CategoryModel } from "@/domain/models/postgres/CategoryModel";

export const mockCategory: CategoryModel = {
  id: "category-123",
  name: "Food",
  description: "Expenses related to food and dining",
  type: "expense",
  record_type_id: 1,
  user_id: "user-123",
  monthly_records: [],
  transactions: [],
  created_at: new Date("2025-07-05T10:00:00Z"),
  updated_at: new Date("2025-07-05T10:00:00Z"),
};
