// import { ServerError } from "@/data/errors/ServerError";
// import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
// import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
// import { CategoryModel } from "@/domain/models/postgres/CategoryModel";
// import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
// import { GetByUserIdCategoryUseCaseProtocol } from "@/data/usecases/interfaces/category/getByUserIdCategoryUseCaseProtocol";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { getByUserIdCategoryValidationSchema } from "@/data/usecases/validation/category/getByUserIdCategoryValidationSchema";

// export class GetByUserIdMonthlyRecordUseCase
//   implements GetByUserIdMonthlyRecordUseCaseProtocol
// {
//   constructor(
//     private readonly categoryRepository: CategoryRepositoryProtocol,
//     private readonly userRepository: UserRepositoryProtocol
//   ) {}

//   async handle(data: GetByUserIdCategoryUseCaseProtocol.Params): Promise<any> {
//     try {
//     } catch (error: any) {
//       if (error.name === "ValidationError") {
//         throw error;
//       }

//       if (
//         error instanceof BusinessRuleError ||
//         error instanceof NotFoundError
//       ) {
//         throw error;
//       }

//       const errorMessage =
//         error.message || "Erro interno do servidor durante a busca";
//       throw new ServerError(`Falha na busca das categorias: ${errorMessage}`);
//     }
//   }
// }
