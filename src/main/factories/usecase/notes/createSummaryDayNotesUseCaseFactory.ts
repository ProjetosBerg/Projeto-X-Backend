import { CreateSummaryDayNotesUseCase } from "@/data/usecases/notes/createSummaryDayNotesUseCase";
import { NotesRepository } from "@/infra/db/postgres/notesRepository";
import { RoutinesRepository } from "@/infra/db/postgres/routinesRepository";

export const makeCreateSummaryDayNotesUseCaseFactory = () => {
  return new CreateSummaryDayNotesUseCase(
    new NotesRepository(),
    new RoutinesRepository()
  );
};
