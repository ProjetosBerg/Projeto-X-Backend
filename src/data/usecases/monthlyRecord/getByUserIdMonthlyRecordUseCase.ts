import { ServerError } from "@/data/errors/ServerError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { GetByUserIdMonthlyRecordUseCaseProtocol } from "@/data/usecases/interfaces/monthlyRecord/getByUserIdMonthlyRecordUseCaseProtocol";
import { MonthlyRecordMock } from "@/domain/models/postgres/MonthlyRecordModel";
import { getByUserIdMonthlyRecordValidationSchema } from "@/data/usecases/validation/monthlyRecord/getByUserIdMonthlyRecordValidationSchema";

/**
 * Recupera todos os registros mensais de um usuário específico
 *
 * @param {GetByUserIdMonthlyRecordUseCaseProtocol.Params} data - Os dados de entrada contendo o ID do usuário
 * @param {string} data.userId - O ID do usuário cujos registros mensais devem ser recuperados
 *
 * @returns {Promise<MonthlyRecordMock[]>} A lista de registros mensais
 *
 * @throws {ValidationError} Se o userId fornecido for inválido
 * @throws {NotFoundError} Se o usuário não for encontrado
 * @throws {ServerError} Se ocorrer um erro inesperado durante a recuperação
 */

export class GetByUserIdMonthlyRecordUseCase
  implements GetByUserIdMonthlyRecordUseCaseProtocol
{
  constructor(
    private readonly monthlyRecordRepository: MonthlyRecordRepositoryProtocol,
    private readonly userRepository: UserRepositoryProtocol
  ) {}

  async handle(
    data: GetByUserIdMonthlyRecordUseCaseProtocol.Params
  ): Promise<MonthlyRecordMock[]> {
    try {
      await getByUserIdMonthlyRecordValidationSchema.validate(data, {
        abortEarly: false,
      });
      console.log("chegou auqi");
      const user = await this.userRepository.findOne({ id: data.userId });
      if (!user) {
        throw new NotFoundError(`Usuário com ID ${data.userId} não encontrado`);
      }
      console.log("chegou auqi 2");

      const monthlyRecords = await this.monthlyRecordRepository.findByUserId({
        userId: data.userId,
        categoryId: data.categoryId,
      });

      return monthlyRecords;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      if (error instanceof NotFoundError) {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante a busca";
      throw new ServerError(
        `Falha na busca dos registros mensais: ${errorMessage}`
      );
    }
  }
}
