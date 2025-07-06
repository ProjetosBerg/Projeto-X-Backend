import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { CreateRecordTypeUseCaseProtocol } from "@/data/usecases/interfaces/recordTypes/createRecordTypeUseCaseProtocol";
import { RecordTypesRepositoryProtocol } from "@/infra/db/interfaces/recordTypesRepositoryProtocol";
import { RecordTypeModel } from "@/domain/models/postgres/RecordTypesModel";
import { createRecordTypeValidationSchema } from "@/data/usecases/validation/recordTypes/createRecordTypeValidationSchema";

export class CreateRecordTypeUseCase
  implements CreateRecordTypeUseCaseProtocol
{
  constructor(
    private readonly recordTypeRepository: RecordTypesRepositoryProtocol
  ) {}

  async handle(
    data: CreateRecordTypeUseCaseProtocol.Params
  ): Promise<RecordTypeModel> {
    try {
      await createRecordTypeValidationSchema.validate(data, {
        abortEarly: false,
      });

      const existingRecordType =
        await this.recordTypeRepository.findByNameAndUserId({
          name: data?.name,
          user_id: data?.userId,
        });
      if (existingRecordType) {
        throw new BusinessRuleError(
          `Já existe um tipo de registro com o nome "${data?.name}" para este usuário`
        );
      }

      const recordType = {
        user_id: data?.userId,
        name: data?.name,
        icone: data?.icone,
      };

      return await this.recordTypeRepository.create(recordType);
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      if (error instanceof BusinessRuleError) {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante o cadastro";
      throw new ServerError(
        `Falha no cadastro do record type: ${errorMessage}`
      );
    }
  }
}
