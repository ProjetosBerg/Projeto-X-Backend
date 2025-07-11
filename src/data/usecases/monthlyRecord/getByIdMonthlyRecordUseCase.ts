// import { ServerError } from "@/data/errors/ServerError";
// import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
// import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
// import { CategoryModel } from "@/domain/models/postgres/CategoryModel";
// import { getByIdCategoryValidationSchema } from "../validation/category/getByIdCategoryValidationSchema";
// import { GetByIdCategoryUseCaseProtocol } from "../interfaces/category/getByIdCategoryUseCaseProtocol";

// export class GetByIdMonthlyRecordUseCase
//   implements GetByIdMonthlyRecordUseCaseProtocol
// {
//   constructor(
//     private readonly categoryRepository: CategoryRepositoryProtocol,
//     private readonly userRepository: UserRepositoryProtocol
//   ) {}

//   async handle(data: GetByIdMonthlyRecordUseCaseProtocol.Params): Promise<any> {
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
