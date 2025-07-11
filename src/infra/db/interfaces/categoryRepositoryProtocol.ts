import { CategoryModel } from "@/domain/models/postgres/CategoryModel";

export interface CategoryRepositoryProtocol {
  create(
    data: CategoryRepositoryProtocol.CreateCategory
  ): Promise<CategoryModel>;
  findByNameAndUserId(
    data: CategoryRepositoryProtocol.FindByNameAndUserIdParams
  ): Promise<CategoryModel | null>;
  findByUserId(
    data: CategoryRepositoryProtocol.FindByUserIdParams
  ): Promise<CategoryModel[]>;
  findByIdAndUserId(
    data: CategoryRepositoryProtocol.FindByIdAndUserIdParams
  ): Promise<CategoryModel | null>;
  deleteCategory(
    data: CategoryRepositoryProtocol.DeleteCategoryParams
  ): Promise<void>;
  updateCategory(
    data: CategoryRepositoryProtocol.UpdateCategoryParams
  ): Promise<CategoryModel>;
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

  export type FindByUserIdParams = {
    userId: CategoryModel["user_id"];
  };

  export type FindByIdAndUserIdParams = {
    id: CategoryModel["id"];
    userId: CategoryModel["user_id"];
  };
  export type DeleteCategoryParams = {
    id: CategoryModel["id"];
    userId: CategoryModel["user_id"];
  };

  export type UpdateCategoryParams = {
    id: string;
    name?: string;
    description?: string;
    type?: string;
    recordTypeId: number;
    userId: string;
  };
}
