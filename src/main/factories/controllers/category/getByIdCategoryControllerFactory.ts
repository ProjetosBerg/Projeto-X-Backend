import { GetByUserIdCategoryController } from "@/presentation/controllers/category/getByUserIdCategoryController";
import { makeGetByUserIdCategoryUseCaseFactory } from "../../usecase/category/getByIdCategoryUseCaseFactory";

export const makeGetByUserIdCategoryControllerFactory = () => {
  return new GetByUserIdCategoryController(
    makeGetByUserIdCategoryUseCaseFactory()
  );
};
