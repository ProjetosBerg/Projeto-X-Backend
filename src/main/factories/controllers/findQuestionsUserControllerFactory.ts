import { ForgotPasswordController } from "@/presentation/controllers/users/forgotPasswordUserController";
import { FindQuestionsController } from "@/presentation/controllers/users/findQuestionsUserController";
import { makeFindQuestionsUserUseCaseFactory } from "../usecase/users/findQuestionsUserUseCaseFactory";

export const makeFindQuestionsUserControllerFactory = () => {
  return new FindQuestionsController(makeFindQuestionsUserUseCaseFactory());
};
