import { ServerError } from "@/data/errors/ServerError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { NotificationRepositoryProtocol } from "@/infra/db/interfaces/notificationRepositoryProtocol";
import { DeleteMonthlyRecordUseCaseProtocol } from "@/data/usecases/interfaces/monthlyRecord/deleteMonthlyRecordUseCaseProtocol";
import { NotificationModel } from "@/domain/models/postgres/NotificationModel";
import { deleteMonthlyRecordValidationSchema } from "@/data/usecases/validation/monthlyRecord/deleteMonthlyRecordValidationSchema";

/**
 * Exclui um registro mensal pelo seu ID para um usuário específico
 *
 * @param {DeleteMonthlyRecordUseCaseProtocol.Params} data - Os dados de entrada para a exclusão do registro mensal
 * @param {string} data.monthlyRecordId - O ID do registro mensal a ser excluído
 * @param {string} data.userId - O ID do usuário proprietário do registro mensal
 *
 * @returns {Promise<void>} É resolvida quando o registro mensal é excluído com sucesso
 *
 * @throws {ValidationError} Se os dados fornecidos forem inválidos
 * @throws {NotFoundError} Se o usuário ou o registro mensal não forem encontrados
 * @throws {ServerError} Se ocorrer um erro inesperado durante a exclusão
 */

export class DeleteMonthlyRecordUseCase
  implements DeleteMonthlyRecordUseCaseProtocol
{
  constructor(
    private readonly monthlyRecordRepository: MonthlyRecordRepositoryProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly notificationRepository: NotificationRepositoryProtocol
  ) {}

  async handle(data: DeleteMonthlyRecordUseCaseProtocol.Params): Promise<void> {
    try {
      await deleteMonthlyRecordValidationSchema.validate(data, {
        abortEarly: false,
      });

      const user = await this.userRepository.findOne({ id: data.userId });
      if (!user) {
        throw new NotFoundError(`Usuário com ID ${data.userId} não encontrado`);
      }

      const monthlyRecord =
        await this.monthlyRecordRepository.findByIdAndUserId({
          id: data.monthlyRecordId,
          userId: data.userId,
        });

      if (!monthlyRecord) {
        throw new NotFoundError(
          `Registro mensal com ID ${data.monthlyRecordId} não encontrado para este usuário`
        );
      }

      await this.monthlyRecordRepository.delete({
        id: data.monthlyRecordId,
        userId: data.userId,
      });

      await this.notificationRepository.create({
        title: `Registro mensal excluído: ${monthlyRecord.title}`,
        entity: "MonthlyRecord",
        idEntity: data.monthlyRecordId,
        userId: data.userId,
        path: `/relatorios/categoria/relatorio-mesal/${monthlyRecord?.category?.id}`,
        typeOfAction: "Exclusão",
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
      throw new ServerError(
        `Falha ao deletar o registro mensal: ${errorMessage}`
      );
    }
  }
}
