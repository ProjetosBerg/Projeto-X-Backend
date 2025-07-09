import { CategoryModel } from "@/domain/models/postgres/CategoryModel";

export interface GetByUserIdCategoryUseCaseProtocol {
  handle(
    data: GetByUserIdCategoryUseCaseProtocol.Params
  ): Promise<CategoryModel[]>;
}

export namespace GetByUserIdCategoryUseCaseProtocol {
  export type Params = {
    userId: CategoryModel["user_id"];
  };
}
