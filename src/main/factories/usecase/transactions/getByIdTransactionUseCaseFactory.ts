import { UserRepository } from "@/infra/db/postgres/userRepository";
import { MonthlyRecordRepository } from "@/infra/db/postgres/monthlyRecordRepository";
import { GetByIdTransactionUseCase } from "@/data/usecases/transactions/getByIdTransactionUseCase";
import { TransactionRepository } from "@/infra/db/postgres/transactionRepository";

export const makeGetByIdTransactionUseCaseFactory = () => {
  return new GetByIdTransactionUseCase(
    new TransactionRepository(),
    new UserRepository(),
    new MonthlyRecordRepository()
  );
};
