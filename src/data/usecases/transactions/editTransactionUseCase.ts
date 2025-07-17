import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import { EditTransactionUseCaseProtocol } from "@/data/usecases/interfaces/transactions/editTransactionUseCaseProtocol";
import {
  TransactionModel,
  TransactionModelMock,
} from "@/domain/models/postgres/TransactionModel";
import { TransactionRepositoryProtocol } from "@/infra/db/interfaces/transactionRepositoryProtocol";
import { editTransactionValidationSchema } from "../validation/transactions/editTransactionValidationSchema";

/**
 * Atualiza uma transação existente para um usuário específico
 *
 * @param {EditTransactionUseCaseProtocol.Params} data - Os dados de entrada para a atualização da transação
 * @param {string} data.id - O ID da transação a ser atualizada
 * @param {string} data.userId - O ID do usuário proprietário da transação
 * @param {string} [data.title] - O novo título da transação (opcional)
 * @param {string | null} [data.description] - A nova descrição da transação (opcional)
 * @param {number} [data.amount] - O novo valor da transação (opcional)
 * @param {Date} [data.transactionDate] - A nova data da transação (opcional)
 * @param {string} [data.monthlyRecordId] - O novo ID do registro mensal (opcional)
 * @param {string} [data.categoryId] - O novo ID da categoria (opcional)
 *
 * @returns {Promise<TransactionModel>} A transação atualizada
 *
 * @throws {ValidationError} Se os dados fornecidos forem inválidos
 * @throws {NotFoundError} Se o usuário, a categoria, o registro mensal ou a transação não forem encontrados
 * @throws {BusinessRuleError} Se a data da transação não estiver dentro do mês e ano do registro mensal
 * @throws {ServerError} Se ocorrer um erro inesperado durante a atualização
 */

export class EditTransactionUseCase implements EditTransactionUseCaseProtocol {
  constructor(
    private readonly transactionRepository: TransactionRepositoryProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly categoryRepository: CategoryRepositoryProtocol,
    private readonly monthlyRecordRepository: MonthlyRecordRepositoryProtocol
  ) {}

  async handle(
    data: EditTransactionUseCaseProtocol.Params
  ): Promise<TransactionModelMock> {
    try {
      await editTransactionValidationSchema.validate(data, {
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

      const monthlyRecordId =
        data.monthlyRecordId ?? transaction.monthly_record_id;
      const monthlyRecord =
        await this.monthlyRecordRepository.findByIdAndUserId({
          id: String(monthlyRecordId),
          userId: data.userId,
        });
      if (!monthlyRecord) {
        throw new NotFoundError(
          `Registro mensal com ID ${monthlyRecordId} não encontrado para este usuário`
        );
      }

      if (data.categoryId) {
        const category = await this.categoryRepository.findByIdAndUserId({
          id: data.categoryId,
          userId: data.userId,
        });
        if (!category) {
          throw new NotFoundError(
            `Categoria com ID ${data.categoryId} não encontrada para este usuário`
          );
        }
      }

      if (data?.transactionDate) {
        const transactionDate = new Date(data.transactionDate);
        const recordMonth = monthlyRecord.month;
        const recordYear = monthlyRecord.year;
        const transactionMonth = transactionDate.getMonth() + 1;
        const transactionYear = transactionDate.getFullYear();

        if (
          transactionMonth !== recordMonth ||
          transactionYear !== recordYear
        ) {
          throw new BusinessRuleError(
            `A data da transação deve estar dentro do mês ${recordMonth} e ano ${recordYear} do registro mensal`
          );
        }
      }

      const updatedTransaction = await this.transactionRepository.update({
        id: data.transactionId,
        userId: data.userId,
        title: data.title,
        description: data.description,
        amount: data.amount,
        transaction_date: data.transactionDate,
        monthly_record_id: data.monthlyRecordId,
        category_id: data.categoryId,
      });

      return updatedTransaction;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      if (
        error instanceof BusinessRuleError ||
        error instanceof NotFoundError
      ) {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante a atualização";
      throw new ServerError(
        `Falha na atualização da transação: ${errorMessage}`
      );
    }
  }
}
