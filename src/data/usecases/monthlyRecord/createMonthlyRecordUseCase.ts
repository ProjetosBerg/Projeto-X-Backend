import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
import { CreateMonthlyRecordUseCaseProtocol } from "@/data/usecases/interfaces/monthlyRecord/createMonthlyRecordUseCaseProtocol";
import {
  MonthlyRecordMock,
  MonthlyRecordModel,
} from "@/domain/models/postgres/MonthlyRecordModel";
import { createMonthlyRecordValidationSchema } from "@/data/usecases/validation/monthlyRecord/createMonthlyRecordValidationSchema";

/**
 * Cria um novo registro mensal para um usuário
 *
 * @param {CreateMonthlyRecordUseCaseProtocol.Params} data - Os dados de entrada para a criação do registro mensal
 * @param {string} data.title - O título do registro mensal
 * @param {string} [data.description] - A descrição do registro mensal (opcional)
 * @param {string} data.goal - O objetivo do registro mensal
 * @param {number} [data.initial_balance] - O saldo inicial do registro mensal (opcional)
 * @param {number} data.month - O mês do registro (1 a 12)
 * @param {number} data.year - O ano do registro
 * @param {string} data.categoryId - O ID da categoria associada
 * @param {string} data.userId - O ID do usuário proprietário do registro
 *
 * @returns {Promise<MonthlyRecordModel>} O registro mensal criado
 *
 * @throws {ValidationError} Se os dados fornecidos forem inválidos
 * @throws {NotFoundError} Se o usuário ou a categoria não forem encontrados
 * @throws {BusinessRuleError} Se já existir um registro mensal com o mesmo título, usuário, categoria, mês e ano
 * @throws {ServerError} Se ocorrer um erro inesperado durante a criação
 */

export class CreateMonthlyRecordUseCase
  implements CreateMonthlyRecordUseCaseProtocol
{
  constructor(
    private readonly monthlyRecordRepository: MonthlyRecordRepositoryProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly categoryRepository: CategoryRepositoryProtocol
  ) {}

  async handle(
    data: CreateMonthlyRecordUseCaseProtocol.Params
  ): Promise<MonthlyRecordMock> {
    try {
      await createMonthlyRecordValidationSchema.validate(data, {
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

      const existingRecord =
        await this.monthlyRecordRepository.findOneMonthlyRecord({
          userId: data.userId,
          categoryId: data.categoryId,
          month: data.month,
          year: data.year,
        });

      if (existingRecord) {
        throw new BusinessRuleError(
          `Já existe um registro mensal para esta categoria, usuário, mês ${data.month} e ano ${data.year}`
        );
      }

      const createdMonthlyRecord = await this.monthlyRecordRepository.create({
        title: data.title,
        description: data.description,
        goal: data.goal,
        initial_balance: data.initial_balance,
        month: data.month,
        year: data.year,
        categoryId: data.categoryId,
        userId: data.userId,
      });

      return createdMonthlyRecord;
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
      throw new ServerError(
        `Falha no cadastro de registro mensal: ${errorMessage}`
      );
    }
  }
}
