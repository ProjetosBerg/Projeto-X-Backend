import UserAuth from "@/auth/users/userAuth";
import { EditUserByIdUseCase } from "@/data/usecases/users/editUserByIdUseCase";
import { UserRepository } from "@/infra/db/postgres/userRepository";

export const makeEditUserByIdUseCaseFactory = () => {
  return new EditUserByIdUseCase(new UserRepository(), new UserAuth());
};
