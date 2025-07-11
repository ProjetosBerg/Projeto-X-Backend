import { Repository, getRepository } from "typeorm";
import { Category } from "@/domain/entities/postgres/Category";
import { CategoryModel } from "@/domain/models/postgres/CategoryModel";
import { User } from "@/domain/entities/postgres/User";
import { RecordTypes } from "@/domain/entities/postgres/RecordTypes";
import { CategoryRepositoryProtocol } from "../interfaces/categoryRepositoryProtocol";
import { NotFoundError } from "@/data/errors/NotFoundError";

export class CategoryRepository implements CategoryRepositoryProtocol {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async create(
    data: CategoryRepositoryProtocol.CreateCategory
  ): Promise<CategoryModel> {
    const category = this.repository.create({
      name: data.name,
      description: data.description,
      type: data.type,
      record_type: { id: data.recordTypeId } as RecordTypes,
      user: { id: data.userId } as User,
    });

    const savedCategory = await this.repository.save(category);
    return {
      id: savedCategory.id,
      name: savedCategory.name,
      description: savedCategory.description,
      type: savedCategory.type,
      record_type_id: savedCategory.record_type.id,
      user_id: savedCategory.user.id,
      monthly_records: savedCategory?.monthly_records || [],
      transactions: savedCategory?.transactions || [],
      created_at: savedCategory.created_at,
      updated_at: savedCategory.updated_at,
    };
  }

  async findByNameAndUserId(
    data: CategoryRepositoryProtocol.FindByNameAndUserIdParams
  ): Promise<CategoryModel | null> {
    const category = await this.repository.findOne({
      where: {
        name: data.name,
        user: { id: data.userId },
        record_type: { id: data.recordTypeId },
      },
      relations: ["user", "record_type", "monthly_records", "transactions"],
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      type: category.type,
      record_type_id: category.record_type.id,
      user_id: category.user.id,
      monthly_records: category.monthly_records || [],
      transactions: category.transactions || [],
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }

  async findByUserId(
    data: CategoryRepositoryProtocol.FindByUserIdParams
  ): Promise<Category[]> {
    return await this.repository.find({
      where: { user: { id: data.userId } },
      relations: ["record_type", "user"],
    });
  }

  async findByIdAndUserId(
    data: CategoryRepositoryProtocol.FindByIdAndUserIdParams
  ): Promise<CategoryModel | null> {
    const category = await this.repository.findOne({
      where: {
        id: data.id,
        user: { id: data.userId },
      },
      relations: ["user", "record_type", "monthly_records", "transactions"],
    });

    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      type: category.type,
      record_type_id: category.record_type.id,
      user_id: category.user.id,
      monthly_records: category.monthly_records || [],
      transactions: category.transactions || [],
      created_at: category.created_at,
      updated_at: category.updated_at,
    };
  }

  async deleteCategory(
    data: CategoryRepositoryProtocol.DeleteCategoryParams
  ): Promise<void> {
    const category = await this.repository.findOne({
      where: {
        id: data.id,
        user: { id: data.userId },
      },
    });

    if (!category) {
      throw new NotFoundError(
        `Categoria com ID ${data.id} não encontrada para este usuário`
      );
    }

    await this.repository.delete({
      id: data.id,
      user: { id: data.userId },
    });
  }
  async updateCategory(
    data: CategoryRepositoryProtocol.UpdateCategoryParams
  ): Promise<CategoryModel> {
    const category = await this.repository.findOne({
      where: {
        id: data.id,
        user: { id: data.userId },
      },
      relations: ["user", "record_type", "monthly_records", "transactions"],
    });

    if (!category) {
      throw new NotFoundError(
        `Categoria com ID ${data.id} não encontrada para este usuário`
      );
    }

    if (data.name) category.name = data.name;
    if (data.description) category.description = data.description || "";
    if (data.type) category.type = data.type;
    if (data.recordTypeId)
      category.record_type = { id: data.recordTypeId } as RecordTypes;
    category.updated_at = new Date();

    const updatedCategory = await this.repository.save(category);
    return {
      id: updatedCategory.id,
      name: updatedCategory.name,
      description: updatedCategory.description,
      type: updatedCategory.type,
      record_type_id: updatedCategory.record_type.id,
      user_id: updatedCategory.user.id,
      monthly_records: updatedCategory.monthly_records || [],
      transactions: updatedCategory.transactions || [],
      created_at: updatedCategory.created_at,
      updated_at: updatedCategory.updated_at,
    };
  }
}
