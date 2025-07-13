// import { ServerError } from "@/data/errors/ServerError";
// import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { TransactionRepositoryProtocol } from "@/infra/db/interfaces/TransactionRepositoryProtocol";
// import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
// import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
// import { EditTransactionUseCaseProtocol } from "@/data/usecases/interfaces/Transaction/editTransactionUseCaseProtocol";
// import { TransactionMock } from "@/domain/models/postgres/TransactionModel";
// import { editTransactionValidationSchema } from "@/data/usecases/validation/Transaction/editTransactionValidationSchema";

// /**
//  * Atualiza um registro mensal existente para um usuário específico
//  *
//  * @param {EditTransactionUseCaseProtocol.Params} data - Os dados de entrada para a atualização do registro mensal
//  * @param {string} data.id - O ID do registro mensal a ser atualizado
//  * @param {string} data.userId - O ID do usuário proprietário do registro mensal
//  * @param {string} [data.title] - O novo título do registro mensal (opcional)
//  * @param {string | null} [data.description] - A nova descrição do registro mensal (opcional)
//  * @param {string} [data.goal] - O novo objetivo do registro mensal (opcional)
//  * @param {number | null} [data.initial_balance] - O novo saldo inicial do registro mensal (opcional)
//  * @param {string} [data.categoryId] - O novo ID da categoria do registro mensal (opcional)
//  *
//  * @returns {Promise<TransactionModel>} O registro mensal atualizado
//  *
//  * @throws {ValidationError} Se os dados fornecidos forem inválidos
//  * @throws {NotFoundError} Se o usuário, a categoria ou o registro mensal não forem encontrados
//  * @throws {BusinessRuleError} Se já existir um registro mensal para a nova categoria, usuário, mês e ano
//  * @throws {ServerError} Se ocorrer um erro inesperado durante a atualização
//  */

// export class EditTransactionUseCase implements EditTransactionUseCaseProtocol {
//   constructor(
//     private readonly TransactionRepository: TransactionRepositoryProtocol,
//     private readonly userRepository: UserRepositoryProtocol,
//     private readonly categoryRepository: CategoryRepositoryProtocol
//   ) {}

//   async handle(
//     data: EditTransactionUseCaseProtocol.Params
//   ): Promise<TransactionMock> {
//     try {
//       await editTransactionValidationSchema.validate(data, {
//         abortEarly: false,
//       });
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
//         `Falha na atualização do registro mensal: ${errorMessage}`
//       );
//     }
//   }
// }
