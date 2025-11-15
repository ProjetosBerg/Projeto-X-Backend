import { ServerError } from "@/data/errors/ServerError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { NotesRepositoryProtocol } from "@/infra/db/interfaces/notesRepositoryProtocol";
import { NotificationRepositoryProtocol } from "@/infra/db/interfaces/notificationRepositoryProtocol";
import { DeleteNotesUseCaseProtocol } from "../interfaces/notes/deleteNotesUseCaseProtocol";
import { deleteNotesValidationSchema } from "../validation/notes/deleteNotesValidationSchema";
import { NotificationModel } from "@/domain/models/postgres/NotificationModel";

/**
 * Deleta uma Anotação existente para um usuário
 *
 * @param {DeleteNotesUseCaseProtocol.Params} data - Os dados de entrada para a deleção da Anotação
 * @param {string} data.noteId - O ID da Anotação a ser deletada
 * @param {string} data.userId - O ID do usuário proprietário da nota
 *
 * @returns {Promise<void>} Não retorna valor
 *
 * @throws {ValidationError} Se os dados fornecidos forem inválidos
 * @throws {NotFoundError} Se a Anotação não for encontrada para o usuário
 * @throws {ServerError} Se ocorrer um erro inesperado durante a deleção
 */

export class DeleteNotesUseCase implements DeleteNotesUseCaseProtocol {
  constructor(
    private readonly notesRepository: NotesRepositoryProtocol,
    private readonly notificationRepository: NotificationRepositoryProtocol
  ) {}

  async handle(data: DeleteNotesUseCaseProtocol.Params): Promise<void> {
    try {
      await deleteNotesValidationSchema.validate(data, {
        abortEarly: false,
      });

      const existingNote = await this.notesRepository.findByIdAndUserId({
        id: data.noteId,
        userId: data.userId,
      });

      if (!existingNote) {
        throw new NotFoundError(
          `Anotação com ID ${data.noteId} não encontrada para este usuário`
        );
      }

      await this.notesRepository.deleteNote({
        id: data.noteId,
        userId: data.userId,
      });

      await this.notificationRepository.create({
        title: `Anotação excluída: ${existingNote.activity}`,
        entity: "Anotação",
        idEntity: data.noteId,
        userId: data.userId,
        path: `/anotacoes`,
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
      throw new ServerError(`Falha na deleção de anotação: ${errorMessage}`);
    }
  }
}
