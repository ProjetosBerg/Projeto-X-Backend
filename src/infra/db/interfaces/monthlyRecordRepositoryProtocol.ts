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
  findByUserId(
    data: MonthlyRecordRepositoryProtocol.FindByUserIdParams
  ): Promise<MonthlyRecordMock[]>;
  findByIdAndUserId(
    data: MonthlyRecordRepositoryProtocol.FindByIdAndUserIdParams
  ): Promise<MonthlyRecordMock | null>;
  update(
    data: MonthlyRecordRepositoryProtocol.UpdateMonthlyRecord
  ): Promise<MonthlyRecordMock>;
  delete(
    data: MonthlyRecordRepositoryProtocol.DeleteMonthlyRecordParams
  ): Promise<void>;
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
  export type FindByUserIdParams = {
    userId: MonthlyRecordModel["user_id"];
    categoryId: MonthlyRecordModel["category_id"];
  };

  export type FindByIdAndUserIdParams = {
    id: MonthlyRecordModel["id"];
    userId: MonthlyRecordModel["user_id"];
  };
  export type UpdateMonthlyRecord = {
    id: MonthlyRecordModel["id"];
    userId: MonthlyRecordModel["user_id"];
    title?: MonthlyRecordModel["title"];
    description?: MonthlyRecordModel["description"] | null;
    goal?: MonthlyRecordModel["goal"];
    initial_balance?: MonthlyRecordModel["initial_balance"] | null;
    categoryId?: MonthlyRecordModel["category_id"];
  };
  export type DeleteMonthlyRecordParams = {
    id: MonthlyRecordModel["id"];
    userId: MonthlyRecordModel["user_id"];
  };
}
