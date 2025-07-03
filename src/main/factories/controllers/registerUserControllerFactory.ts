import { RegisterUserController } from "@/presentation/controllers/users/registerUserController";
import { makeRegisterUserUseCaseFactory } from "@/main/factories/usecase/users/registerUserUseCaseFactory";

export const makeRegisterUserUseControllerFactory = () => {
  return new RegisterUserController(makeRegisterUserUseCaseFactory());
};
