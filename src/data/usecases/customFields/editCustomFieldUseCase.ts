// import { ServerError } from "@/data/errors/ServerError";
// import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { EditTransactionUseCaseProtocol } from "@/data/usecases/interfaces/transactions/editTransactionUseCaseProtocol";
// import { EditCustomFieldUseCaseProtocol } from "@/data/usecases/interfaces/customFields/editCustomFieldUseCaseProtocol";
// import { editCustomFieldValidationSchema } from "@/data/usecases/validation/customFields/editCustomFieldValidationSchema";

// export class EditCustomFieldUseCase implements EditCustomFieldUseCaseProtocol {
//   constructor() {}

//   async handle(data: EditTransactionUseCaseProtocol.Params): Promise<any> {
//     try {
//       await editCustomFieldValidationSchema.validate(data, {
//         abortEarly: false,
//       });

//       return;
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
//         `Falha na atualização de custom field: ${errorMessage}`
//       );
//     }
//   }
// }
