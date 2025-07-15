import { GetByUserIdMonthlyRecordUseCase } from "@/data/usecases/monthlyRecord/getByUserIdMonthlyRecordUseCase";
import { UserRepository } from "@/infra/db/postgres/userRepository";
import { MonthlyRecordRepository } from "@/infra/db/postgres/monthlyRecordRepository";
import { GetByUserIdTransactionUseCase } from "@/data/usecases/transactions/getByUserIdTransactionUseCase";
import { TransactionRepository } from "@/infra/db/postgres/transactionRepository";

export const makeGetByUserIdTransactionUseCaseFactory = () => {
  return new GetByUserIdTransactionUseCase(
    new TransactionRepository(),
    new UserRepository(),
    new MonthlyRecordRepository()
  );
};
