import UserAuth from "@/auth/users/userAuth";
import { LoginUserUseCase } from "@/data/usecases/users/loginUserUseCase";
import { UserRepository } from "@/infra/db/postgres/userRepository";

export const makeLoginUserUseCaseFactory = () => {
  return new LoginUserUseCase(new UserRepository(), new UserAuth());
};
