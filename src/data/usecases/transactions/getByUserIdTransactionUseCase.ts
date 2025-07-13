// import { ServerError } from "@/data/errors/ServerError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { TransactionRepositoryProtocol } from "@/infra/db/interfaces/TransactionRepositoryProtocol";
// import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
// import { GetByUserIdTransactionUseCaseProtocol } from "@/data/usecases/interfaces/Transaction/getByUserIdTransactionUseCaseProtocol";
// import { getByUserIdTransactionValidationSchema } from "@/data/usecases/validation/Transaction/getByUserIdTransactionValidationSchema";

// export class GetByUserIdTransactionUseCase
//   implements GetByUserIdTransactionUseCaseProtocol
// {
//   constructor(
//     private readonly TransactionRepository: TransactionRepositoryProtocol,
//     private readonly userRepository: UserRepositoryProtocol
//   ) {}

//   async handle(
//     data: GetByUserIdTransactionUseCaseProtocol.Params
//   ): Promise<any> {
//     try {
//       await getByUserIdTransactionValidationSchema.validate(data, {
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
//         error.message || "Erro interno do servidor durante a busca";
//       throw new ServerError(
//         `Falha na busca dos registros mensais: ${errorMessage}`
//       );
//     }
//   }
// }
