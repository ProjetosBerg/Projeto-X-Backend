import {
  MonthlyRecordMock,
  MonthlyRecordModel,
} from "@/domain/models/postgres/MonthlyRecordModel";

export interface MonthlyRecordRepositoryProtocol {
  create(
    data: MonthlyRecordRepositoryProtocol.CreateMonthlyRecord
  ): Promise<MonthlyRecordMock>;
  findOneMonthlyRecord(
    data: MonthlyRecordRepositoryProtocol.FindByUserIdAndCategoryIdAndMonthYearParams
  ): Promise<MonthlyRecordMock | null>;
}

export namespace MonthlyRecordRepositoryProtocol {
  export type CreateMonthlyRecord = {
    title: MonthlyRecordModel["title"];
    description?: MonthlyRecordModel["description"];
    goal: MonthlyRecordModel["goal"];
    initial_balance?: MonthlyRecordModel["initial_balance"];
    month: MonthlyRecordModel["month"];
    year: MonthlyRecordModel["year"];
    categoryId: MonthlyRecordModel["category_id"];
    userId: MonthlyRecordModel["user_id"];
  };

  export type FindByUserIdAndCategoryIdAndMonthYearParams = {
    userId: MonthlyRecordModel["user_id"];
    categoryId: MonthlyRecordModel["category_id"];
    month: MonthlyRecordModel["month"];
    year: MonthlyRecordModel["year"];
  };
}
