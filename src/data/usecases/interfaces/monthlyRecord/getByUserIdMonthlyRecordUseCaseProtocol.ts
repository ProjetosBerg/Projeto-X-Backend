import {
  MonthlyRecordModel,
  MonthlyRecordMock,
} from "@/domain/models/postgres/MonthlyRecordModel";

export interface GetByUserIdMonthlyRecordUseCaseProtocol {
  handle(
    data: GetByUserIdMonthlyRecordUseCaseProtocol.Params
  ): Promise<MonthlyRecordMock[]>;
}

export namespace GetByUserIdMonthlyRecordUseCaseProtocol {
  export type Params = {
    categoryId: MonthlyRecordModel["category_id"];
    userId: MonthlyRecordModel["user_id"];
  };
}
