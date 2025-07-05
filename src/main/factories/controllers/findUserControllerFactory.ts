import { FindUserByIdController } from "@/presentation/controllers/users/findUserByIdController";
import { makeFindUserByIdUseCaseFactory } from "../usecase/users/findUserUseCaseFactory";

export const makeFindUserByIdControllerFactory = () => {
  return new FindUserByIdController(makeFindUserByIdUseCaseFactory());
};
