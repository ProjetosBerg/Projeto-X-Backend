import { RegisterUserCase } from "@/data/usecases/users/registerUserUseCase";

export const makeRegisterUserUseCaseFactory = () => {
  return new RegisterUserCase();
};
