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

  /**
   * Busca todos os tipos de registros de um usuário específico
   * @param {RecordTypesRepositoryProtocol.FindByUserIdParams} data - Os dados contendo o ID do usuário
   * @param {string} data.userId - O ID do usuário proprietário dos tipos de registro
   * @returns {Promise<RecordTypeModel[]>} Um array com os tipos de registros do usuário com os dados normalizados
   * @throws {Error} Se ocorrer um erro durante a busca no banco de dados
   */

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

  /**
   * Busca um tipo de registro pelo ID e ID do usuário
   * @param {RecordTypesRepositoryProtocol.FindByIdRecordTypeParams} data - Os dados contendo o ID do tipo de registro e do usuário
   * @param {number} data.id - O ID do tipo de registro a ser buscado
   * @param {string} data.userId - O ID do usuário proprietário do tipo de registro
   * @returns {Promise<RecordTypeModel | null>} O tipo de registro encontrado com dados normalizados ou null se não encontrado
   * @throws {Error} Se ocorrer um erro durante a busca no banco de dados
   */
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

  /**
   * Atualiza um tipo de registro existente para um usuário
   * @param {RecordTypesRepositoryProtocol.UpdateRecordTypes} data - Os dados contendo as informações do tipo de registro a ser atualizado
   * @param {number} data.id - O ID do tipo de registro
   * @param {string} data.userId - O ID do usuário proprietário
   * @param {string} data.name - O novo nome do tipo de registro (opcional)
   * @param {string} data.icone - O novo ícone do tipo de registro (opcional)
   * @returns {Promise<RecordTypeModel>} O tipo de registro atualizado com os dados normalizados
   * @throws {BusinessRuleError} Se o tipo de registro não for encontrado
   * @throws {Error} Se ocorrer um erro durante a atualização
   */
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

  /**
   * Exclui um tipo de registro de um usuário
   * @param {RecordTypesRepositoryProtocol.DeleteRecordTypesParams} data - Os dados contendo o ID do tipo de registro e o ID do usuário
   * @param {number} data.id - O ID do tipo de registro a ser excluído
   * @param {string} data.userId - O ID do usuário proprietário do tipo de registro
   * @returns {Promise<void>} Uma promessa resolvida quando o tipo de registro for excluído
   * @throws {BusinessRuleError} Se o tipo de registro não for encontrado
   * @throws {Error} Se ocorrer um erro durante a exclusão
   */

  async deleteRecordTypes(
    data: RecordTypesRepositoryProtocol.DeleteRecordTypesParams
  ): Promise<void> {
    const recordType = await this.repository.findOne({
      where: { id: data.id, user_id: { id: data.userId } },
    });

    if (!recordType) {
      throw new BusinessRuleError(
        `Nenhum tipo de registro encontrado com o ID ${data.id} para este usuário`
      );
    }

    await this.repository.delete({
      id: data.id,
      user_id: { id: data.userId },
    });
  }
}
