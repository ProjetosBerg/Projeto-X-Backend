// import { ServerError } from "@/data/errors/ServerError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { TransactionRepositoryProtocol } from "@/infra/db/interfaces/TransactionRepositoryProtocol";
// import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
// import { TransactionModel } from "@/domain/models/postgres/TransactionModel";
// import { GetByIdTransactionUseCaseProtocol } from "../interfaces/transactions/getByIdTransactionUseCaseProtocol";

// export class GetByIdTransactionUseCase
//   implements GetByIdTransactionUseCaseProtocol
// {
//   constructor(
//     private readonly TransactionRepository: TransactionRepositoryProtocol,
//     private readonly userRepository: UserRepositoryProtocol
//   ) {}

//   async handle(
//     data: GetByIdTransactionUseCaseProtocol.Params
//   ): Promise<any> {
//     try {
//       await getByIdTransactionValidationSchema.validate(data, {
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
//         `Falha na busca do registro mensal: ${errorMessage}`
//       );
//     }
//   }
// }
