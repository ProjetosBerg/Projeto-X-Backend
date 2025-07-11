// import { ServerError } from "@/data/errors/ServerError";
// import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
// import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
// import { RecordTypesRepositoryProtocol } from "@/infra/db/interfaces/recordTypesRepositoryProtocol";
// import { EditCategoryUseCaseProtocol } from "@/data/usecases/interfaces/category/editCategoryUseCaseProtocol";
// import { CategoryModel } from "@/domain/models/postgres/CategoryModel";
// import { editCategoryValidationSchema } from "../validation/category/editCategoryValidationSchema";

// export class EditMonthlyRecordUseCase
//   implements EditMonthlyRecordUseCaseProtocol
// {
//   constructor(
//     private readonly categoryRepository: CategoryRepositoryProtocol,
//     private readonly recordTypeRepository: RecordTypesRepositoryProtocol,
//     private readonly userRepository: UserRepositoryProtocol
//   ) {}

//   async handle(data: EditCategoryUseCaseProtocol.Params): Promise<any> {
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
//         error.message || "Erro interno do servidor durante a atualização";
//       throw new ServerError(
//         `Falha na atualização de categoria: ${errorMessage}`
//       );
//     }
//   }
// }
