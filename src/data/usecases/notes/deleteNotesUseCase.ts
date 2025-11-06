import { ServerError } from "@/data/errors/ServerError";
import { NotFoundError } from "@/data/errors/NotFoundError";

import { NotesRepositoryProtocol } from "@/infra/db/interfaces/notesRepositoryProtocol";
import { DeleteNotesUseCaseProtocol } from "../interfaces/notes/deleteNotesUseCaseProtocol";
import { deleteNotesValidationSchema } from "../validation/notes/deleteNotesValidationSchema";

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
  constructor(private readonly notesRepository: NotesRepositoryProtocol) {}

  async handle(data: DeleteNotesUseCaseProtocol.Params): Promise<void> {
    try {
      await deleteNotesValidationSchema.validate(data, {
        abortEarly: false,
      });

      await this.notesRepository.deleteNote({
        id: data.noteId,
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
      throw new ServerError(`Falha na deleção de anotação: ${errorMessage}`);
    }
  }
}
