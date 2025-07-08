import { CategoryModel } from "@/domain/models/postgres/CategoryModel";

export interface CategoryRepositoryProtocol {
  create(
    data: CategoryRepositoryProtocol.CreateCategory
  ): Promise<CategoryModel>;
  findByNameAndUserId(
    data: CategoryRepositoryProtocol.FindByNameAndUserIdParams
  ): Promise<CategoryModel | null>;
}

export namespace CategoryRepositoryProtocol {
  export type CreateCategory = {
    name: CategoryModel["name"];
    description?: CategoryModel["description"];
    type: CategoryModel["type"];
    recordTypeId: CategoryModel["record_type_id"];
    userId: CategoryModel["user_id"];
  };

  export type FindByNameAndUserIdParams = {
    name: CategoryModel["name"];
    userId: CategoryModel["user_id"];
    recordTypeId: CategoryModel["record_type_id"];
  };
}
