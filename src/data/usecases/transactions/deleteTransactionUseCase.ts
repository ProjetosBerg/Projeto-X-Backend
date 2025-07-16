import { ServerError } from "@/data/errors/ServerError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import { DeleteTransactionUseCaseProtocol } from "@/data/usecases/interfaces/transactions/deleteTransactionUseCaseProtocol";
import { TransactionRepositoryProtocol } from "@/infra/db/interfaces/transactionRepositoryProtocol";
import { deleteTransactionValidationSchema } from "../validation/transactions/deleteTransactionValidationSchema";

/**
 * Deletes a transaction by its ID for a specific user
 *
 * @param {DeleteTransactionUseCaseProtocol.Params} data - The input data for deleting the transaction
 * @param {string} data.id - The ID of the transaction to delete
 * @param {string} data.userId - The ID of the user who owns the transaction
 *
 * @returns {Promise<void>} Resolves when the transaction is successfully deleted
 *
 * @throws {ValidationError} If the provided data is invalid
 * @throws {NotFoundError} If the user, monthly record, or transaction is not found
 * @throws {ServerError} If an unexpected error occurs during deletion
 */
export class DeleteTransactionUseCase
  implements DeleteTransactionUseCaseProtocol
{
  constructor(
    private readonly transactionRepository: TransactionRepositoryProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly monthlyRecordRepository: MonthlyRecordRepositoryProtocol
  ) {}

  async handle(data: DeleteTransactionUseCaseProtocol.Params): Promise<void> {
    try {
      await deleteTransactionValidationSchema.validate(data, {
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
          `Registro mensal com ID ${transaction?.monthly_record_id} não encontrado para este usuário`
        );
      }

      await this.transactionRepository.delete({
        id: data.transactionId,
        userId: data.userId,
      });
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      if (error instanceof NotFoundError) {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante a deleção";
      throw new ServerError(`Falha ao deletar a transação: ${errorMessage}`);
    }
  }
}
