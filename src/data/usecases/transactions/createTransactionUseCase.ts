// import { ServerError } from "@/data/errors/ServerError";
// import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
// import { NotFoundError } from "@/data/errors/NotFoundError";
// import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
// import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";
// import { CreateTransactionUseCaseProtocol } from "../interfaces/transactions/createTransactionUseCaseProtocol";
// import { createTransactionValidationSchema } from "./../validation/transactions/createTransactionValidationSchema";

// /**
//  * Cria um novo registro mensal para um usuário
//  *
//  * @param {CreateTransactionUseCaseProtocol.Params} data - Os dados de entrada para a criação do registro mensal
//  * @param {string} data.title - O título do registro mensal
//  * @param {string} [data.description] - A descrição do registro mensal (opcional)
//  * @param {string} data.goal - O objetivo do registro mensal
//  * @param {string} data.status - O status do registro mensal
//  * @param {number} [data.initial_balance] - O saldo inicial do registro mensal (opcional)
//  * @param {number} data.month - O mês do registro (1 a 12)
//  * @param {number} data.year - O ano do registro
//  * @param {string} data.categoryId - O ID da categoria associada
//  * @param {string} data.userId - O ID do usuário proprietário do registro
//  *
//  * @returns {Promise<TransactionModel>} O registro mensal criado
//  *
//  * @throws {ValidationError} Se os dados fornecidos forem inválidos
//  * @throws {NotFoundError} Se o usuário ou a categoria não forem encontrados
//  * @throws {BusinessRuleError} Se já existir um registro mensal com o mesmo título, usuário, categoria, mês e ano
//  * @throws {ServerError} Se ocorrer um erro inesperado durante a criação
//  */

// export class CreateTransactionUseCase
//   implements CreateTransactionUseCaseProtocol
// {
//   constructor(
//     private readonly TransactionRepository: TransactionRepositoryProtocol,
//     private readonly userRepository: UserRepositoryProtocol,
//     private readonly categoryRepository: CategoryRepositoryProtocol
//   ) {}

//   async handle(data: CreateTransactionUseCaseProtocol.Params): Promise<any> {
//     try {
//       await createTransactionValidationSchema.validate(data, {
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
//         error.message || "Erro interno do servidor durante o cadastro";
//       throw new ServerError(
//         `Falha no cadastro de registro mensal: ${errorMessage}`
//       );
//     }
//   }
// }
