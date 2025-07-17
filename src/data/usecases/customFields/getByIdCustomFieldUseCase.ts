// import { ServerError } from "@/data/errors/ServerError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { getByIdCustomFieldValidationSchema } from "@/data/usecases/validation/customFields/getByIdCustomFieldValidationSchema";
// import { GetByIdCustomFieldUseCaseProtocol } from "@/data/usecases/interfaces/customFields/getByIdCustomFieldUseCaseProtocol";

// export class GetByIdCustomFieldUseCase
//   implements GetByIdCustomFieldUseCaseProtocol
// {
//   constructor() {}

//   async handle(data: GetByIdCustomFieldUseCaseProtocol.Params): Promise<any> {
//     try {
//       await getByIdCustomFieldValidationSchema.validate(data, {
//         abortEarly: false,
//       });

//       return "";
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
