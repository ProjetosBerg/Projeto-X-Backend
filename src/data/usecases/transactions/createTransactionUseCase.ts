import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import { CreateTransactionUseCaseProtocol } from "@/data/usecases/interfaces/transactions/createTransactionUseCaseProtocol";
import {
  TransactionModel,
  TransactionModelMock,
} from "@/domain/models/postgres/TransactionModel";
import { createTransactionValidationSchema } from "@/data/usecases/validation/transactions/createTransactionValidationSchema";
import { TransactionRepositoryProtocol } from "@/infra/db/interfaces/transactionRepositoryProtocol";

/**
 * Cria uma nova transação para um usuário específico e um registro mensal
 *
 * @param {CreateTransactionUseCaseProtocol.Params} data - Os dados de entrada para a criação da transação
 * @param {string} data.title - O título da transação
 * @param {string} [data.description] - A descrição da transação (opcional)
 * @param {number} data.amount - O valor da transação
 * @param {Date} data.transaction_date - A data da transação
 * @param {string} data.monthly_record_id - O ID do registro mensal associado
 * @param {string} data.category_id - O ID da categoria associada
 * @param {string} data.user_id - O ID do usuário proprietário da transação
 *
 * @returns {Promise<TransactionModel>} A transação criada
 *
 * @throws {ValidationError} Se os dados fornecidos forem inválidos
 * @throws {NotFoundError} Se o usuário, a categoria ou o registro mensal não forem encontrados
 * @throws {BusinessRuleError} Se a data da transação não estiver dentro do mês e ano do registro mensal
 * @throws {ServerError} Se ocorrer um erro inesperado durante a criação
 */

export class CreateTransactionUseCase
  implements CreateTransactionUseCaseProtocol
{
  constructor(
    private readonly transactionRepository: TransactionRepositoryProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly categoryRepository: CategoryRepositoryProtocol,
    private readonly monthlyRecordRepository: MonthlyRecordRepositoryProtocol
  ) {}

  async handle(
    data: CreateTransactionUseCaseProtocol.Params
  ): Promise<TransactionModelMock> {
    try {
      await createTransactionValidationSchema.validate(data, {
        abortEarly: false,
      });

      const user = await this.userRepository.findOne({ id: data.userId });
      if (!user) {
        throw new NotFoundError(`Usuário com ID ${data.userId} não encontrado`);
      }

      const category = await this.categoryRepository.findByIdAndUserId({
        id: data.categoryId,
        userId: data.userId,
      });
      if (!category) {
        throw new NotFoundError(
          `Categoria com ID ${data.categoryId} não encontrada para este usuário`
        );
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

      const transactionDate = new Date(data.transactionDate);
      const recordMonth = monthlyRecord.month;
      const recordYear = monthlyRecord.year;
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();

      if (transactionMonth !== recordMonth || transactionYear !== recordYear) {
        throw new BusinessRuleError(
          `A data da transação deve estar dentro do mês ${recordMonth} e ano ${recordYear} do registro mensal`
        );
      }

      const transaction = await this.transactionRepository.create({
        title: data.title,
        description: data?.description,
        amount: data?.amount,
        transaction_date: data.transactionDate,
        monthly_record_id: data.monthlyRecordId,
        category_id: data.categoryId,
        user_id: data.userId,
      });

      return transaction;
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
        error.message || "Erro interno do servidor durante o cadastro";
      throw new ServerError(`Falha no cadastro da transação: ${errorMessage}`);
    }
  }
}
