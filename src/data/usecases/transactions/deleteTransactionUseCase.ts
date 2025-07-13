// import { ServerError } from "@/data/errors/ServerError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { TransactionRepositoryProtocol } from "@/infra/db/interfaces/TransactionRepositoryProtocol";
// import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
// import { DeleteTransactionUseCaseProtocol } from "@/data/usecases/interfaces/Transaction/deleteTransactionUseCaseProtocol";
// import { deleteTransactionValidationSchema } from "@/data/usecases/validation/Transaction/deleteTransactionValidationSchema";

// /**
//  * Exclui um registro mensal pelo seu ID para um usuário específico
//  *
//  * @param {DeleteTransactionUseCaseProtocol.Params} data - Os dados de entrada para a exclusão do registro mensal
//  * @param {string} data.id - O ID do registro mensal a ser excluído
//  * @param {string} data.userId - O ID do usuário proprietário do registro mensal
//  *
//  * @returns {Promise<void>} É resolvida quando o registro mensal é excluído com sucesso
//  *
//  * @throws {ValidationError} Se os dados fornecidos forem inválidos
//  * @throws {NotFoundError} Se o usuário ou o registro mensal não forem encontrados
//  * @throws {ServerError} Se ocorrer um erro inesperado durante a exclusão
//  */

// export class DeleteTransactionUseCase
//   implements DeleteTransactionUseCaseProtocol
// {
//   constructor(
//     private readonly TransactionRepository: TransactionRepositoryProtocol,
//     private readonly userRepository: UserRepositoryProtocol
//   ) {}

//   async handle(data: DeleteTransactionUseCaseProtocol.Params): Promise<void> {
//     try {
//       await deleteTransactionValidationSchema.validate(data, {
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
//       throw new ServerError(
//         `Falha ao deletar o registro mensal: ${errorMessage}`
//       );
//     }
//   }
// }
