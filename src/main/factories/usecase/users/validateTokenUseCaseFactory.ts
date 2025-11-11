import { ValidateTokenUseCase } from "@/data/usecases/users/validateTokenUseCase";
import { AuthenticationRepository } from "@/infra/db/postgres/authenticationRepository";

export const makeValidateTokenUseCaseFactory = () => {
  return new ValidateTokenUseCase(new AuthenticationRepository());
};
