// import { ServerError } from "@/data/errors/ServerError";
// import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
// import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
// import { deleteCategoryValidationSchema } from "@/data/usecases/validation/category/deleteCategoryValidationSchema";
// import { DeleteCategoryUseCaseProtocol } from "@/data/usecases/interfaces/category/deleteCategoryUseCaseProtocol";

// export class DeleteMonthlyRecordUseCase
//   implements DeleteMonthlyRecordUseCaseProtocol
// {
//   constructor(
//     private readonly categoryRepository: CategoryRepositoryProtocol,
//     private readonly userRepository: UserRepositoryProtocol
//   ) {}

//   async handle(data: DeleteMonthlyRecordUseCaseProtocol.Params): Promise<void> {
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
//         error.message || "Erro interno do servidor durante a deleção";
//       throw new ServerError(`Falha ao deletar categoria: ${errorMessage}`);
//     }
//   }
// }
