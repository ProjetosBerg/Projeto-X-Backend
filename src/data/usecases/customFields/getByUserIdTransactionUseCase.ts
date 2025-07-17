// import { ServerError } from "@/data/errors/ServerError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { GetByUserIdCustomFieldUseCaseProtocol } from "@/data/usecases/interfaces/customFields/getByUserIdCustomFieldUseCaseProtocol";
// import { getByUserIdCustomFieldValidationSchema } from "@/data/usecases/validation/customFields/getByUserIdCustomFieldValidationSchema";

// export class GetByUserIdCustomFieldUseCase
//   implements GetByUserIdCustomFieldUseCaseProtocol
// {
//   constructor() {}

//   async handle(
//     data: GetByUserIdCustomFieldUseCaseProtocol.Params
//   ): Promise<any> {
//     try {
//       await getByUserIdCustomFieldValidationSchema.validate(data, {
//         abortEarly: false,
//       });

//       return;
//     } catch (error: any) {
//       if (error.name === "ValidationError") {
//         throw error;
//       }

//       if (error instanceof NotFoundError) {
//         throw error;
//       }

//       const errorMessage =
//         error.message || "Erro interno do servidor durante a busca";
//       throw new ServerError(`Falha na busca de custom field: ${errorMessage}`);
//     }
//   }
// }
