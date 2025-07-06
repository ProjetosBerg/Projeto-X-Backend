import { RecordTypeModel } from "@/domain/models/postgres/RecordTypesModel";
import { getRepository, Repository } from "typeorm";
import { RecordTypesRepositoryProtocol } from "../interfaces/recordTypesRepositoryProtocol";
import { RecordTypes } from "@/domain/entities/postgres/RecordTypes";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";

export class RecordTypeRepository implements RecordTypesRepositoryProtocol {
  private repository: Repository<RecordTypes>;

  constructor() {
    this.repository = getRepository(RecordTypes);
  }
  /**
   * Cria um novo tipo de registro no banco de dados
   * @param {RecordTypesRepositoryProtocol.CreateRecordTypesParams} data - Os dados do tipo de registro a ser criado
   * @param {string} data.userId - O ID do usuário proprietário do tipo de registro
   * @param {string} data.name - O nome do tipo de registro
   * @param {string} data.icone - O ícone do tipo de registro
   * @returns {Promise<RecordTypeModel>} O tipo de registro criado com os dados normalizados
   * @throws {Error} Se ocorrer um erro durante a criação no banco de dados
   */
  async create(
    data: RecordTypesRepositoryProtocol.CreateRecordTypesParams
  ): Promise<RecordTypeModel> {
    const recordType = this.repository.create({
      user_id: { id: data.userId },
      name: data.name,
      icone: data.icone,
    });

    const savedRecordType = await this.repository.save(recordType);
    return {
      ...savedRecordType,
      user_id: savedRecordType?.user_id.id,
    };
  }

  /**
   * Busca um tipo de registro pelo nome e ID do usuário
   * @param {RecordTypesRepositoryProtocol.FindByNameAndUserIdParams} data - Os dados para buscar o tipo de registro
   * @param {string} data.name - O nome do tipo de registro a ser buscado
   * @param {string} data.userId - O ID do usuário proprietário do tipo de registro
   * @returns {Promise<RecordTypeModel | null>} O tipo de registro encontrado com dados normalizados ou null se não encontrado
   * @throws {Error} Se ocorrer um erro durante a busca no banco de dados
   */
  async findByNameAndUserId(
    data: RecordTypesRepositoryProtocol.FindByNameAndUserIdParams
  ): Promise<RecordTypeModel | null> {
    const recordType = await this.repository.findOne({
      where: { name: data.name, user_id: { id: data.userId } },
      relations: ["user_id"],
    });

    if (!recordType) return null;

    return {
      ...recordType,
      user_id: recordType?.user_id.id,
    };
  }

  async findByUserId(
    data: RecordTypesRepositoryProtocol.FindByUserIdParams
  ): Promise<RecordTypeModel[]> {
    const recordTypes = await this.repository.find({
      where: { user_id: { id: data?.userId } },
      relations: ["user_id"],
    });

    return recordTypes.map((recordType) => ({
      id: recordType.id,
      user_id: recordType.user_id.id,
      name: recordType.name,
      icone: recordType.icone,
      created_at: recordType.created_at,
      updated_at: recordType.updated_at,
    }));
  }

  async findByIdRecordType(
    data: RecordTypesRepositoryProtocol.FindByIdRecordTypeParams
  ): Promise<RecordTypeModel | null> {
    const recordType = await this.repository.findOne({
      where: { id: data.id, user_id: { id: data.userId } },
      relations: ["user_id"],
    });

    if (!recordType) return null;

    return {
      id: recordType.id,
      user_id: recordType.user_id?.id,
      name: recordType.name,
      icone: recordType.icone,
      created_at: recordType.created_at,
      updated_at: recordType.updated_at,
    };
  }

  async updateRecordTypes(
    data: RecordTypesRepositoryProtocol.UpdateRecordTypes
  ): Promise<RecordTypeModel> {
    const recordType = await this.repository.findOne({
      where: { id: data.id, user_id: { id: data.userId } },
      relations: ["user_id"],
    });

    if (!recordType) {
      throw new BusinessRuleError(
        `Nenhum tipo de registro encontrado com o ID ${data.id} para este usuário`
      );
    }

    if (data.name) recordType.name = data.name;
    if (data.icone) recordType.icone = data.icone;
    recordType.updated_at = new Date();

    const updatedRecordType = await this.repository.save(recordType);
    return {
      id: updatedRecordType.id,
      user_id: updatedRecordType.user_id.id,
      name: updatedRecordType.name,
      icone: updatedRecordType.icone,
      created_at: updatedRecordType.created_at,
      updated_at: updatedRecordType.updated_at,
    };
  }
}
