import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { NotesModel } from "@/domain/models/postgres/NotesModel";
import { NotesRepositoryProtocol } from "@/infra/db/interfaces/notesRepositoryProtocol";
import { RoutinesRepositoryProtocol } from "@/infra/db/interfaces/routinesRepositoryProtocol";
import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
import { EditNotesUseCaseProtocol } from "../interfaces/notes/editNotesUseCaseProtocol";
import { editNotesValidationSchema } from "../validation/notes/editNotesValidationSchema";

/**
 * Edita uma nota existente para um usuário
 *
 * @param {EditNotesUseCaseProtocol.Params} data - Os dados de entrada para a edição da nota
 * @param {string} [data.status] - O novo status da nota (opcional)
 * @param {string[]} [data.collaborators] - Novos colaboradores (opcional)
 * @param {string} [data.priority] - Nova prioridade (opcional)
 * @param {string} [data.category_id] - Novo ID da categoria (opcional)
 * @param {string} [data.activity] - Nova atividade (opcional)
 * @param {string} [data.activityType] - Novo tipo de atividade (opcional)
 * @param {string} [data.description] - Nova descrição (opcional)
 * @param {string} [data.startTime] - Nova hora de início (opcional)
 * @param {string} [data.endTime] - Nova hora de fim (opcional)
 * @param {Comment[]} [data.comments] - Novos comentários (opcional)
 * @param {string} [data.routine_id] - Novo ID da rotina (opcional)
 * @param {string} data.noteId - O ID da nota a ser editada
 * @param {string} data.userId - O ID do usuário proprietário da nota
 *
 * @returns {Promise<NotesModel>} A nota editada
 *
 * @throws {ValidationError} Se os dados fornecidos forem inválidos
 * @throws {NotFoundError} Se a nota não for encontrada para o usuário
 * @throws {BusinessRuleError} Se o novo routine_id ou category_id não existirem para o usuário
 * @throws {ServerError} Se ocorrer um erro inesperado durante a edição
 */

export class EditNotesUseCase implements EditNotesUseCaseProtocol {
  constructor(
    private readonly notesRepository: NotesRepositoryProtocol,
    private readonly routinesRepository: RoutinesRepositoryProtocol,
    private readonly categoryRepository: CategoryRepositoryProtocol
  ) {}

  async handle(data: EditNotesUseCaseProtocol.Params): Promise<NotesModel> {
    try {
      await editNotesValidationSchema.validate(data, {
        abortEarly: false,
      });

      const existingNote = await this.notesRepository.findByIdAndUserId({
        id: data.noteId,
        userId: data.userId,
      });

      if (!existingNote) {
        throw new NotFoundError(
          `Nota com ID ${data.noteId} não encontrada para este usuário`
        );
      }

      const newRoutineId = data.routine_id || existingNote.routine_id;
      if (data.routine_id !== existingNote.routine_id) {
        const existingRoutine = await this.routinesRepository.findByIdAndUserId(
          {
            id: newRoutineId,
            userId: data.userId,
          }
        );

        if (!existingRoutine) {
          throw new BusinessRuleError(
            `Nenhuma rotina encontrada com o ID ${newRoutineId} para este usuário`
          );
        }
      }

      const newCategoryId =
        data.category_id !== undefined
          ? data.category_id
          : existingNote.category_id;
      if (
        data.category_id !== undefined &&
        data.category_id !== existingNote.category_id
      ) {
        const existingCategory =
          await this.categoryRepository.findByIdAndUserId({
            id: newCategoryId!,
            userId: data.userId,
          });

        if (!existingCategory) {
          throw new BusinessRuleError(
            `Nenhuma categoria encontrada com o ID ${newCategoryId} para este usuário`
          );
        }
      }

      const updatedNote = await this.notesRepository.updateNote({
        status: data.status,
        collaborators: data.collaborators,
        priority: data.priority,
        category_id: data.category_id,
        activity: data.activity,
        activityType: data.activityType,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        comments: data.comments,
        routine_id: data.routine_id,
        id: data.noteId,
        userId: data.userId,
      });

      return updatedNote;
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
        error.message || "Erro interno do servidor durante a edição";
      throw new ServerError(`Falha na edição de nota: ${errorMessage}`);
    }
  }
}
