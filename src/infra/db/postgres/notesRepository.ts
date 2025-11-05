import { Repository, getRepository } from "typeorm";
import { Notes } from "@/domain/entities/postgres/Notes";
import { NotesModel } from "@/domain/models/postgres/NotesModel";
import { User } from "@/domain/entities/postgres/User";
import { Routines } from "@/domain/entities/postgres/Routines";
import { Category } from "@/domain/entities/postgres/Category";
import { NotesRepositoryProtocol } from "../interfaces/notesRepositoryProtocol";

export class NotesRepository implements NotesRepositoryProtocol {
  private repository: Repository<Notes>;

  constructor() {
    this.repository = getRepository(Notes);
  }

  /**
   * Cria uma nova nota no banco de dados
   * @param {NotesRepositoryProtocol.CreateNote} data - Os dados para criação da nota
   * @param {string} data.status - Status da nota
   * @param {string[]} [data.collaborators] - Colaboradores opcionais
   * @param {string} data.priority - Prioridade da nota
   * @param {string} [data.category_id] - ID da categoria opcional
   * @param {string} data.activity - Atividade da nota
   * @param {string} data.activityType - Tipo de atividade
   * @param {string} data.description - Descrição da nota
   * @param {string} data.startTime - Hora de início
   * @param {string} data.endTime - Hora de fim
   * @param {Comment[]} [data.comments] - Comentários opcionais
   * @param {string} data.routine_id - ID da rotina
   * @param {string} data.userId - ID do usuário
   * @returns {Promise<NotesModel>} A nota criada
   */
  async create(data: NotesRepositoryProtocol.CreateNote): Promise<NotesModel> {
    const note = this.repository.create({
      status: data.status,
      collaborators: data.collaborators,
      priority: data.priority,
      activity: data.activity,
      activityType: data.activityType,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      comments: data.comments,
      routine: { id: data.routine_id } as Routines,
      user: { id: data.userId } as User,
      ...(data.category_id && {
        category: { id: data.category_id } as Category,
      }),
    });

    const savedNote = await this.repository.save(note);
    return {
      id: savedNote.id,
      status: savedNote.status,
      collaborators: savedNote.collaborators,
      priority: savedNote.priority,
      category_id: savedNote.category?.id,
      activity: savedNote.activity,
      activityType: savedNote.activityType,
      description: savedNote.description,
      startTime: savedNote.startTime,
      endTime: savedNote.endTime,
      comments: savedNote.comments,
      routine_id: savedNote.routine.id,
      user_id: savedNote.user.id,
      created_at: savedNote.created_at,
      updated_at: savedNote.updated_at,
    };
  }
}
