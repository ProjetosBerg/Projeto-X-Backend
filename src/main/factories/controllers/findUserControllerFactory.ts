import { FindUserByIdController } from "@/presentation/controllers/users/FindUserByIdController";
import { makeFindUserByIdUseCaseFactory } from "../usecase/users/findUserUseCaseFactory";

export const makeFindUserControllerFactory = () => {
  return new FindUserByIdController(makeFindUserByIdUseCaseFactory());
};
