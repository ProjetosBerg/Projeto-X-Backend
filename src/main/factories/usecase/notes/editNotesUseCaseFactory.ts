import { EditNotesUseCase } from "@/data/usecases/notes/editNotesUseCase";
import { NotesRepository } from "@/infra/db/postgres/notesRepository";
import { CategoryRepository } from "@/infra/db/postgres/categoryRepository";
import { RoutinesRepository } from "@/infra/db/postgres/routinesRepository";

export const makeEditNotesUseCaseFactory = () => {
  return new EditNotesUseCase(
    new NotesRepository(),
    new RoutinesRepository(),
    new CategoryRepository()
  );
};
