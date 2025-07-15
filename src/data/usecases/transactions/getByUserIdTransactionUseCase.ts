import { ServerError } from "@/data/errors/ServerError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import { TransactionModelMock } from "@/domain/models/postgres/TransactionModel";
import { GetByUserIdTransactionUseCaseProtocol } from "../interfaces/transactions/getByUserIdTransactionUseCaseProtocol";
import { getByUserIdTransactionValidationSchema } from "../validation/transactions/getByUserIdTransactionValidationSchema";
import { TransactionRepositoryProtocol } from "@/infra/db/interfaces/transactionRepositoryProtocol";

/**
 * Recupera todas as transações de um usuário específico para um registro mensal
 *
 * @param {GetByUserIdTransactionUseCaseProtocol.Params} data - Os dados de entrada para a recuperação das transações
 * @param {string} data.userId - O ID do usuário proprietário das transações
 * @param {string} data.monthlyRecordId - O ID do registro mensal associado às transações
 *
 * @returns {Promise<TransactionModelMock[]>} Um array de transações
 *
 * @throws {ValidationError} Se os dados fornecidos forem inválidos
 * @throws {NotFoundError} Se o usuário ou o registro mensal não forem encontrados
 * @throws {ServerError} Se ocorrer um erro inesperado durante a recuperação
 */

export class GetByUserIdTransactionUseCase
  implements GetByUserIdTransactionUseCaseProtocol
{
  constructor(
    private readonly transactionRepository: TransactionRepositoryProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly monthlyRecordRepository: MonthlyRecordRepositoryProtocol
  ) {}

  async handle(
    data: GetByUserIdTransactionUseCaseProtocol.Params
  ): Promise<TransactionModelMock[]> {
    try {
      await getByUserIdTransactionValidationSchema.validate(data, {
        abortEarly: false,
      });

      const user = await this.userRepository.findOne({ id: data.userId });
      if (!user) {
        throw new NotFoundError(`Usuário com ID ${data.userId} não encontrado`);
      }

      const monthlyRecord =
        await this.monthlyRecordRepository.findByIdAndUserId({
          id: String(data.monthlyRecordId),
          userId: data.userId,
        });
      if (!monthlyRecord) {
        throw new NotFoundError(
          `Registro mensal com ID ${data.monthlyRecordId} não encontrado para este usuário`
        );
      }

      const transactions =
        await this.transactionRepository.findByUserIdAndMonthlyRecordId({
          userId: data.userId,
          monthlyRecordId: data.monthlyRecordId,
        });

      return transactions;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      if (error instanceof NotFoundError) {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante a busca";
      throw new ServerError(`Falha na busca das transações: ${errorMessage}`);
    }
  }
}
