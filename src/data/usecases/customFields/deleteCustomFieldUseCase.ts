// import { ServerError } from "@/data/errors/ServerError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { deleteCustomFieldValidationSchema } from "@/data/usecases/validation/customFields/deleteCustomFieldValidationSchema";
// import { DeleteCustomFieldUseCaseProtocol } from "@/data/usecases/interfaces/customFields/deleteCustomFieldUseCaseProtocol";

// export class DeleteCustomFieldUseCase
//   implements DeleteCustomFieldUseCaseProtocol
// {
//   constructor() {}

//   async handle(data: DeleteCustomFieldUseCaseProtocol.Params): Promise<void> {
//     try {
//       await deleteCustomFieldValidationSchema.validate(data, {
//         abortEarly: false,
//       });
//     } catch (error: any) {
//       if (error.name === "ValidationError") {
//         throw error;
//       }

//       if (error instanceof NotFoundError) {
//         throw error;
//       }

//       const errorMessage =
//         error.message || "Erro interno do servidor durante a deleção";
//       throw new ServerError(`Falha ao deletar custom field: ${errorMessage}`);
//     }
//   }
// }
