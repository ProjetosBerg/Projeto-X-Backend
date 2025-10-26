import { ServerError } from "@/data/errors/ServerError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import { CustomFieldsRepositoryProtocol } from "@/infra/db/interfaces/customFieldsRepositoryProtocol";
import { TransactionModelMock } from "@/domain/models/postgres/TransactionModel";
import { GetByUserIdTransactionUseCaseProtocol } from "../interfaces/transactions/getByUserIdTransactionUseCaseProtocol";
import { getByUserIdTransactionValidationSchema } from "../validation/transactions/getByUserIdTransactionValidationSchema";
import { TransactionRepositoryProtocol } from "@/infra/db/interfaces/transactionRepositoryProtocol";
import { CustomFieldValueWithMetadata } from "./utils/customFieldValueWithMetadata";
import { TransactionCustomFieldRepositoryProtocol } from "@/infra/db/interfaces/TransactionCustomFieldRepositoryProtocol";
import { CategoryRepositoryProtocol } from "@/infra/db/interfaces/categoryRepositoryProtocol";

/**
 * Recupera todas as transações de um usuário específico para um registro mensal, enriquecidas com campos customizados
 *
 * @param {GetByUserIdTransactionUseCaseProtocol.Params} data - Os dados de entrada para a recuperação das transações
 * @param {string} data.userId - O ID do usuário proprietário das transações
 * @param {string} data.monthlyRecordId - O ID do registro mensal associado às transações
 *
 * @returns {Promise<Array<{ transaction: TransactionModelMock; customFields?: CustomFieldValueWithMetadata[]; }>>} Um array de transações enriquecidas com campos customizados
 *
 * @throws {ValidationError} Se os dados fornecidos forem inválidos
 * @throws {NotFoundError} Se o usuário ou o registro mensal não forem encontrados
 * @throws {ServerError} Se ocorrer um erro inesperado durante a recuperação
 */

export class GetByUserIdTransactionUseCase
  implements GetByUserIdTransactionUseCaseProtocol
{
  constructor(
    private readonly transactionRepository: TransactionRepositoryProtocol,
    private readonly userRepository: UserRepositoryProtocol,
    private readonly monthlyRecordRepository: MonthlyRecordRepositoryProtocol,
    private readonly customFieldRepository: CustomFieldsRepositoryProtocol,
    private readonly transactionCustomFieldRepository: TransactionCustomFieldRepositoryProtocol,
    private readonly categoryRepository: CategoryRepositoryProtocol
  ) {}

  async handle(data: GetByUserIdTransactionUseCaseProtocol.Params): Promise<
    Array<{
      transaction: TransactionModelMock;
      customFields?: CustomFieldValueWithMetadata[];
    }>
  > {
    let recordTypeId: number | undefined = undefined;
    try {
      await getByUserIdTransactionValidationSchema.validate(data, {
        abortEarly: false,
      });

      const user = await this.userRepository.findOne({ id: data.userId });
      if (!user) {
        throw new NotFoundError(`Usuário com ID ${data.userId} não encontrado`);
      }

      const monthlyRecord =
        await this.monthlyRecordRepository.findByIdAndUserId({
          id: String(data.monthlyRecordId),
          userId: data.userId,
        });
      if (!monthlyRecord) {
        throw new NotFoundError(
          `Registro mensal com ID ${data.monthlyRecordId} não encontrado para este usuário`
        );
      }

      const transactions =
        await this.transactionRepository.findByUserIdAndMonthlyRecordId({
          userId: data.userId,
          monthlyRecordId: data.monthlyRecordId,
        });

      if (transactions.length && transactions.length !== 0) {
        const category = await this.categoryRepository.findByIdAndUserId({
          id: String(transactions[0]?.category_id),
          userId: data.userId,
        });

        if (!category) {
          throw new NotFoundError(
            `Categoria com ID ${transactions[0]?.category_id} não encontrada para este usuário`
          );
        }
        recordTypeId = category?.record_type_id;
      }

      const enrichedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          const customFieldValues =
            await this.transactionCustomFieldRepository.findByTransactionId({
              transaction_id: transaction.id,
              user_id: data.userId,
            });

          let enrichedCustomFields: CustomFieldValueWithMetadata[] = [];
          if (customFieldValues.length > 0) {
            const valueIds = customFieldValues.map((v) => v.custom_field_id);
            const customFieldDefs =
              await this.customFieldRepository.findByIdsAndUserId({
                ids: valueIds,
                user_id: data.userId,
              });

            enrichedCustomFields = customFieldValues.map((value) => {
              const cfDef = customFieldDefs?.find(
                (cf) => cf.id === value.custom_field_id
              );
              if (!cfDef) {
                throw new ServerError(
                  `Definição de campo customizado não encontrada para ID ${value.custom_field_id}`
                );
              }
              return {
                id: value.id!,
                custom_field_id: value.custom_field_id!,
                value: value.value,
                label: cfDef.label,
                type: cfDef.type,
                required: cfDef.required,
              };
            });
          }

          return {
            transaction,
            customFields: enrichedCustomFields,
            recordTypeId,
          };
        })
      );

      return enrichedTransactions;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      if (error instanceof NotFoundError) {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante a busca";
      throw new ServerError(`Falha na busca das transações: ${errorMessage}`);
    }
  }
}
