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
 * Recupera uma transação pelo seu ID para um usuário específico
 *
 * @param {GetByIdTransactionUseCaseProtocol.Params} data - Os dados de entrada para a recuperação da transação
 * @param {string} data.transactionId - O ID da transação a ser recuperada
 * @param {string} data.userId - O ID do usuário proprietário da transação
 *
 * @returns {Promise<TransactionModel>} A transação recuperada
 *
 * @throws {ValidationError} Se os dados fornecidos forem inválidos
 * @throws {NotFoundError} Se o usuário, o registro mensal ou a transação não forem encontrados
 * @throws {ServerError} Se ocorrer um erro inesperado durante a recuperação
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
