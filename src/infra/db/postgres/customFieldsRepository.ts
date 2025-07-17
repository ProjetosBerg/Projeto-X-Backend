import { Repository, getRepository } from "typeorm";
import { CustomField } from "@/domain/entities/mongo/CustomFieldsSchema";
import { CustomFieldsRepositoryProtocol } from "@/infra/db/interfaces/customFieldsRepositoryProtocol";

export class CustomFieldsRepository implements CustomFieldsRepositoryProtocol {
  private repository: Repository<CustomField>;

  constructor() {
    this.repository = getRepository(CustomField);
  }
}
