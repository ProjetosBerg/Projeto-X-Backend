import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { CategoryModel } from "@/domain/models/postgres/CategoryModel";
import { getByIdCategoryValidationSchema } from "../validation/category/getByIdCategoryValidationSchema";
import { GetByIdCategoryUseCaseProtocol } from "../interfaces/category/getByIdCategoryUseCaseProtocol";

/**
 * Retrieves a category by ID for a specific user
 *
 * @param {GetByIdCategoryUseCaseProtocol.Params} data - The input data containing the category ID and user ID
 * @param {string} data.id - The ID of the category to retrieve
 * @param {string} data.userId - The ID of the user who owns the category
 *
 * @returns {Promise<CategoryModel>} The retrieved category
 *
 * @throws {ValidationError} If the provided id or userId is invalid
 * @throws {NotFoundError} If the user or category is not found
 * @throws {ServerError} If an unexpected error occurs during retrieval
 */
export class GetByIdCategoryUseCase implements GetByIdCategoryUseCaseProtocol {
  constructor(
    private readonly categoryRepository: CategoryRepositoryProtocol,
    private readonly userRepository: UserRepositoryProtocol
  ) {}

  async handle(
    data: GetByIdCategoryUseCaseProtocol.Params
  ): Promise<CategoryModel> {
    try {
      await getByIdCategoryValidationSchema.validate(data, {
        abortEarly: false,
      });

      const user = await this.userRepository.findOne({
        id: String(data.userId),
      });

      if (!user) {
        throw new NotFoundError(`Usuário com ID ${data.userId} não encontrado`);
      }

      const category = await this.categoryRepository.findByIdAndUserId({
        id: data.categoryId,
        userId: data.userId,
      });

      if (!category) {
        throw new NotFoundError(
          `Categoria com ID ${data.categoryId} não encontrada para este usuário`
        );
      }

      return category;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      if (
        error instanceof BusinessRuleError ||
        error instanceof NotFoundError
      ) {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante a busca";
      throw new ServerError(`Falha na busca das categorias: ${errorMessage}`);
    }
  }
}
