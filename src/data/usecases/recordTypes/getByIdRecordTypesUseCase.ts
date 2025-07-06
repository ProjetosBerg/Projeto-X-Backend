import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { GetByIdRecordTypeUseCaseProtocol } from "@/data/usecases/interfaces/recordTypes/getByIdRecordTypeUseCaseProtocol";
import { RecordTypesRepositoryProtocol } from "@/infra/db/interfaces/recordTypesRepositoryProtocol";
import { RecordTypeModel } from "@/domain/models/postgres/RecordTypesModel";
import { getByIdRecordTypeValidationSchema } from "@/data/usecases/validation/recordTypes/getByIdRecordTypeValidationSchema";

/**
 * Retrieves a single record type by its ID for a specific user
 *
 * @param {GetByIdRecordTypeUseCaseProtocol.Params} data - The input data containing the record type ID and user ID
 * @param {number} data.id - The ID of the record type to retrieve
 * @param {string} data.user_id - The ID of the user who owns the record type
 *
 * @returns {Promise<RecordTypeModel>} A promise that returns the record type
 *
 * @throws {ValidationError} If the provided id or user_id is invalid
 * @throws {BusinessRuleError} If no record type is found for the given ID and user
 * @throws {ServerError} If an unexpected error occurs during retrieval
 */
export class GetByIdRecordTypeUseCase
  implements GetByIdRecordTypeUseCaseProtocol
{
  constructor(
    private readonly recordTypeRepository: RecordTypesRepositoryProtocol
  ) {}

  async handle(
    data: GetByIdRecordTypeUseCaseProtocol.Params
  ): Promise<RecordTypeModel> {
    try {
      await getByIdRecordTypeValidationSchema.validate(data, {
        abortEarly: false,
      });

      const recordType = await this.recordTypeRepository.findByIdRecordType({
        id: data.recordTypeId,
        userId: data.userId,
      });

      if (!recordType) {
        throw new BusinessRuleError(
          `Nenhum tipo de registro encontrado com o ID ${data.recordTypeId} para este usuário`
        );
      }

      return recordType;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      if (error instanceof BusinessRuleError) {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante a busca";
      throw new ServerError(`Falha na busca de record type: ${errorMessage}`);
    }
  }
}
