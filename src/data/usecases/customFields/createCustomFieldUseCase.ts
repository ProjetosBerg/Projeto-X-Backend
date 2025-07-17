// import { ServerError } from "@/data/errors/ServerError";
// import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { CreateCustomFieldUseCaseProtocol } from "@/data/usecases/interfaces/customFields/createCustomFieldUseCaseProtocol";
// import { createCustomFieldValidationSchema } from "@/data/usecases/validation/customFields/createCustomFieldValidationSchema";

// export class CreateCustomFieldUseCase
//   implements CreateCustomFieldUseCaseProtocol
// {
//   constructor() {}

//   async handle(data: CreateCustomFieldUseCaseProtocol.Params): Promise<any> {
//     try {
//       await createCustomFieldValidationSchema.validate(data, {
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
//         error.message || "Erro interno do servidor durante o cadastro";
//       throw new ServerError(
//         `Falha no cadastro de custom field: ${errorMessage}`
//       );
//     }
//   }
// }
