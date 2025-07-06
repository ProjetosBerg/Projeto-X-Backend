import { User } from "@/domain/entities/postgres/User";
import { RecordTypeModel } from "@/domain/models/postgres/RecordTypesModel";
import { AppDataSource } from "@/loaders/dataSource";
import { getRepository, Repository } from "typeorm";
import { RecordTypesRepositoryProtocol } from "../interfaces/recordTypesRepositoryProtocol";
import { RecordTypes } from "@/domain/entities/postgres/RecordTypes";

export class RecordTypeRepository implements RecordTypesRepositoryProtocol {
  private repository: Repository<RecordTypes>;

  constructor() {
    this.repository = getRepository(RecordTypes);
  }

  async create(
    data: RecordTypesRepositoryProtocol.CreateRecordTypes
  ): Promise<RecordTypeModel> {
    const recordType = this.repository.create({
      user_id: { id: data.user_id },
      name: data.name,
      icone: data.icone,
    });

    const savedRecordType = await this.repository.save(recordType);
    return {
      ...savedRecordType,
      user_id: savedRecordType.user_id.id,
    };
  }

  async findByNameAndUserId(
    data: RecordTypesRepositoryProtocol.FindByNameAndUserIdParams
  ): Promise<RecordTypeModel | null> {
    const recordType = await this.repository.findOne({
      where: { name: data.name, user_id: { id: data.user_id } },
      relations: ["user_id"],
    });

    if (!recordType) return null;

    return {
      ...recordType,
      user_id: recordType.user_id.id,
    };
  }
}
