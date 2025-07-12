import { getRepository, Repository } from "typeorm";
import { MonthlyRecord } from "@/domain/entities/postgres/MonthlyRecord";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import {
  MonthlyRecordMock,
  MonthlyRecordModel,
} from "@/domain/models/postgres/MonthlyRecordModel";
import { User } from "@/domain/entities/postgres/User";
import { Category } from "@/domain/entities/postgres/Category";

export class MonthlyRecordRepository
  implements MonthlyRecordRepositoryProtocol
{
  private repository: Repository<MonthlyRecord>;

  constructor() {
    this.repository = getRepository(MonthlyRecord);
  }

  async create(
    data: MonthlyRecordRepositoryProtocol.CreateMonthlyRecord
  ): Promise<MonthlyRecordMock> {
    const monthlyRecord = this.repository.create({
      title: data.title,
      description: data.description,
      goal: data.goal,
      initial_balance: data.initial_balance ?? 0,
      month: data.month,
      year: data.year,
      category: { id: data.categoryId } as Category,
      user: { id: data.userId } as User,
    });

    const savedMonthlyRecord = await this.repository.save(monthlyRecord);
    return savedMonthlyRecord;
  }

  async findOneMonthlyRecord(
    data: MonthlyRecordRepositoryProtocol.FindByUserIdAndCategoryIdAndMonthYearParams
  ): Promise<MonthlyRecordMock | null> {
    const monthlyRecord = await this.repository.findOne({
      where: {
        user: { id: data.userId },
        category: { id: data.categoryId },
        month: data.month,
        year: data.year,
      },
      relations: ["user", "category", "transactions"],
    });

    if (!monthlyRecord) return null;

    return monthlyRecord;
  }
}
