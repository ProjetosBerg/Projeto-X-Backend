import { DeleteNotesUseCase } from "@/data/usecases/notes/deleteNotesUseCase";
import { NotesRepository } from "@/infra/db/postgres/notesRepository";

export const makeDeleteNotesUseCaseFactory = () => {
  return new DeleteNotesUseCase(new NotesRepository());
};
