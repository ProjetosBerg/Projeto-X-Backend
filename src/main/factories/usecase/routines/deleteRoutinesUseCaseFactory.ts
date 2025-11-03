import { RoutinesRepository } from "@/infra/db/postgres/routinesRepository";

export const makeDeleteRoutinesUseCaseFactory = () => {
  return new DeleteRoutinesUseCase(new RoutinesRepository());
};
