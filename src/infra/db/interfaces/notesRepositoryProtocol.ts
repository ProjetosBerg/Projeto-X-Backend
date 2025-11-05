import { NotesModel } from "@/domain/models/postgres/NotesModel";

export interface NotesRepositoryProtocol {
  create(data: NotesRepositoryProtocol.CreateNote): Promise<NotesModel>;
}

export namespace NotesRepositoryProtocol {
  export type CreateNote = {
    status: NotesModel["status"];
    collaborators?: NotesModel["collaborators"];
    priority: NotesModel["priority"];
    category_id?: NotesModel["category_id"];
    activity: NotesModel["activity"];
    activityType: NotesModel["activityType"];
    description: NotesModel["description"];
    startTime: NotesModel["startTime"];
    endTime: NotesModel["endTime"];
    comments?: NotesModel["comments"];
    routine_id: NotesModel["routine_id"];
    userId: NotesModel["user_id"];
  };
}
