import { GetByUserIdCategoryController } from "@/presentation/controllers/category/getByUserIdCategoryController";
import { makeGetByUserIdCategoryUseCaseFactory } from "../../usecase/category/getByUserIdCategoryUseCaseFactory";

export const makeGetByUserIdRoutinesControllerFactory = () => {
  return new GetByUserIdRoutinesController(
    makeGetByUserIdRoutinesUseCaseFactory()
  );
};
