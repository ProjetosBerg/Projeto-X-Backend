import { UserRepository } from "@/infra/db/postgres/userRepository";
import { MonthlyRecordRepository } from "@/infra/db/postgres/monthlyRecordRepository";
import { ExportTransactionUseCase } from "@/data/usecases/transactions/exportTransactionUseCase";
import { makeGetByUserIdTransactionUseCaseFactory } from "./getByUserIdTransactionUseCaseFactory";
import { makeGenericExportUseCaseFactory } from "../export/GenericExportUseCaseFactory";

export const makeExportTransactionUseCaseFactory = () => {
  return new ExportTransactionUseCase(
    makeGetByUserIdTransactionUseCaseFactory(),
    new UserRepository(),
    new MonthlyRecordRepository(),
    makeGenericExportUseCaseFactory()
  );
};
