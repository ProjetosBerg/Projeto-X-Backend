import { EditMonthlyRecordUseCase } from "@/data/usecases/monthlyRecord/editMonthlyRecordUseCase";
import { CategoryRepository } from "@/infra/db/postgres/categoryRepository";
import { UserRepository } from "@/infra/db/postgres/userRepository";
import { MonthlyRecordRepository } from "@/infra/db/postgres/monthlyRecordRepository";

export const makeEditMonthlyRecordUseCaseFactory = () => {
  return new EditMonthlyRecordUseCase(
    new MonthlyRecordRepository(),
    new UserRepository(),
    new CategoryRepository()
  );
};
