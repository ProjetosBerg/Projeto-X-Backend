import { ServerError } from "@/data/errors/ServerError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import { GetByIdTransactionUseCaseProtocol } from "@/data/usecases/interfaces/transactions/getByIdTransactionUseCaseProtocol";
import {
  TransactionModel,
  TransactionModelMock,
} from "@/domain/models/postgres/TransactionModel";
import { getByIdTransactionValidationSchema } from "@/data/usecases/validation/transactions/getByIdTransactionValidationSchema";
import { TransactionRepositoryProtocol } from "@/infra/db/interfaces/transactionRepositoryProtocol";

/**
 * Retrieves a transaction by its ID for a specific user
 *
 * @param {GetByIdTransactionUseCaseProtocol.Params} data - The input data for retrieving the transaction
 * @param {string} data.id - The ID of the transaction to retrieve
 * @param {string} data.userId - The ID of the user who owns the transaction
 *
 * @returns {Promise<TransactionModel>} The retrieved transaction
 *
 * @throws {ValidationError} If the provided data is invalid
 * @throws {NotFoundError} If the user, monthly record, or transaction is not found
 * @throws {ServerError} If an unexpected error occurs during retrieval
 */
export class GetByIdTransactionUseCase
  implements GetByIdTransactionUseCaseProtocol
{
  constructor(
    private readonly transactionRepository: TransactionRepositoryProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly monthlyRecordRepository: MonthlyRecordRepositoryProtocol
  ) {}

  async handle(
    data: GetByIdTransactionUseCaseProtocol.Params
  ): Promise<TransactionModelMock> {
    try {
      await getByIdTransactionValidationSchema.validate(data, {
        abortEarly: false,
      });

      const user = await this.userRepository.findOne({ id: data.userId });
      if (!user) {
        throw new NotFoundError(`Usuário com ID ${data.userId} não encontrado`);
      }

      const transaction = await this.transactionRepository.findByIdAndUserId({
        id: data.transactionId,
        userId: data.userId,
      });
      if (!transaction) {
        throw new NotFoundError(
          `Transação com ID ${data.transactionId} não encontrada para este usuário`
        );
      }
      const monthlyRecord =
        await this.monthlyRecordRepository.findByIdAndUserId({
          id: String(transaction.monthly_record_id ?? ""),
          userId: data.userId,
        });
      if (!monthlyRecord) {
        throw new NotFoundError(
          `Registro mensal com ID ${transaction.monthly_record_id} não encontrado para este usuário`
        );
      }

      return transaction;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      if (error instanceof NotFoundError) {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante a busca";
      throw new ServerError(`Falha na busca da transação: ${errorMessage}`);
    }
  }
}
