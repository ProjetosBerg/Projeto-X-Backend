import { CreateMonthlyRecordUseCase } from "@/data/usecases/monthlyRecord/createMonthlyRecordUseCase";
import { CategoryRepository } from "@/infra/db/postgres/categoryRepository";
import { MonthlyRecordRepository } from "@/infra/db/postgres/monthlyRecordRepository";
import { UserRepository } from "@/infra/db/postgres/userRepository";

export const makeCreateMonthlyRecordUseCaseFactory = () => {
  return new CreateMonthlyRecordUseCase(
    new MonthlyRecordRepository(),
    new UserRepository(),
    new CategoryRepository()
  );
};
