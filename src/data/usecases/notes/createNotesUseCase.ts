import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotesModel } from "@/domain/models/postgres/NotesModel";
import { RoutinesRepositoryProtocol } from "@/infra/db/interfaces/routinesRepositoryProtocol";
import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
import { NotificationRepositoryProtocol } from "@/infra/db/interfaces/notificationRepositoryProtocol";
import { createNotesValidationSchema } from "../validation/notes/createNotesValidationSchema";
import { CreateNotesUseCaseProtocol } from "../interfaces/notes/createNotesUseCaseProtocol";
import { NotesRepositoryProtocol } from "@/infra/db/interfaces/notesRepositoryProtocol";
import { NotificationModel } from "@/domain/models/postgres/NotificationModel";

/**
 * Cria uma nova Anotação para um usuário
 *
 * @param {CreateNotesUseCaseProtocol.Params} data - Os dados de entrada para a criação da Anotação
 * @param {string} data.status - O status da Anotação
 * @param {string[]} [data.collaborators] - Colaboradores da Anotação (opcional)
 * @param {string} data.priority - A prioridade da Anotação
 * @param {string} [data.category_id] - O ID da categoria associada (opcional)
 * @param {string} data.activity - A atividade da Anotação
 * @param {string} data.activityType - O tipo de atividade
 * @param {string} data.description - A descrição da Anotação
 * @param {string} data.startTime - Hora de início
 * @param {string} data.endTime - Hora de fim
 * @param {Comment[]} [data.comments] - Comentários iniciais (opcional)
 * @param {string} data.routine_id - O ID da rotina associada
 * @param {string} data.userId - O ID do usuário proprietário da Anotação
 *
 * @returns {Promise<NotesModel>} A Anotação criada
 *
 * @throws {ValidationError} Se os dados fornecidos forem inválidos
 * @throws {BusinessRuleError} Se a rotina ou categoria não existirem para o usuário
 * @throws {ServerError} Se ocorrer um erro inesperado durante a criação
 */

export class CreateNotesUseCase implements CreateNotesUseCaseProtocol {
  constructor(
    private readonly notesRepository: NotesRepositoryProtocol,
    private readonly routinesRepository: RoutinesRepositoryProtocol,
    private readonly categoryRepository: CategoryRepositoryProtocol,
    private readonly notificationRepository: NotificationRepositoryProtocol
  ) {}

  async handle(data: CreateNotesUseCaseProtocol.Params): Promise<NotesModel> {
    try {
      await createNotesValidationSchema.validate(data, {
        abortEarly: false,
      });

      const existingRoutine = await this.routinesRepository.findByIdAndUserId({
        id: data.routine_id,
        userId: data.userId,
      });

      if (!existingRoutine) {
        throw new BusinessRuleError(
          `Nenhuma rotina encontrada com o ID ${data.routine_id} para este usuário`
        );
      }

      if (data.category_id) {
        const existingCategory =
          await this.categoryRepository.findByIdAndUserId({
            id: data.category_id,
            userId: data.userId,
          });

        if (!existingCategory) {
          throw new BusinessRuleError(
            `Nenhuma categoria encontrada com o ID ${data.category_id} para este usuário`
          );
        }
      }

      const createdNote = await this.notesRepository.create({
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
        userId: data.userId,
      });

      await this.notificationRepository.create({
        title: `Nova anotação criada: ${data.activity}`,
        entity: "Notes",
        idEntity: createdNote.id,
        userId: data.userId,
        path: `/anotacoes`,
        payload: {
          activity: data.activity,
          activityType: data.activityType,
          priority: data.priority,
          startTime: data.startTime,
          endTime: data.endTime,
          routine_id: data.routine_id,
          category_id: data.category_id,
          routine: existingRoutine,
        } as NotificationModel["payload"],
        typeOfAction: "Criação",
      });

      return createdNote;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      if (error instanceof BusinessRuleError) {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante o cadastro";
      throw new ServerError(`Falha no cadastro de Anotação: ${errorMessage}`);
    }
  }
}
