// import { ServerError } from "@/data/errors/ServerError";
// import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
// import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
// import { RecordTypesRepositoryProtocol } from "@/infra/db/interfaces/recordTypesRepositoryProtocol";

// export class CreateMonthlyRecordUseCase
//   implements CreateMonthlyRecordUseCaseProtocol
// {
//   constructor(
//     private readonly categoryRepository: CategoryRepositoryProtocol,
//     private readonly recordTypeRepository: RecordTypesRepositoryProtocol
//   ) {}

//   async handle(data: CreateMonthlyRecordUseCaseProtocol.Params): Promise<any> {
//     try {
//     } catch (error: any) {
//       if (error.name === "ValidationError") {
//         throw error;
//       }

//       if (error instanceof BusinessRuleError) {
//         throw error;
//       }

//       const errorMessage =
//         error.message || "Erro interno do servidor durante o cadastro";
//       throw new ServerError(`Falha no cadastro de categoria: ${errorMessage}`);
//     }
//   }
// }
