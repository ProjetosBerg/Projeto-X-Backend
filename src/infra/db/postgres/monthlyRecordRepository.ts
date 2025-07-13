import { getRepository, Repository } from "typeorm";
import { MonthlyRecord } from "@/domain/entities/postgres/MonthlyRecord";
import { MonthlyRecordRepositoryProtocol } from "@/infra/db/interfaces/monthlyRecordRepositoryProtocol";
import {
  MonthlyRecordMock,
  MonthlyRecordModel,
} from "@/domain/models/postgres/MonthlyRecordModel";
import { User } from "@/domain/entities/postgres/User";
import { Category } from "@/domain/entities/postgres/Category";
import { NotFoundError } from "@/data/errors/NotFoundError";

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

  async findByUserId(
    data: MonthlyRecordRepositoryProtocol.FindByUserIdParams
  ): Promise<MonthlyRecordMock[]> {
    const monthlyRecords = await this.repository.find({
      where: {
        user: { id: data.userId },
        category: { id: data.categoryId },
      },
      relations: ["user", "category", "transactions"],
    });

    return monthlyRecords.map((record) => ({
      id: record.id,
      title: record.title,
      description: record.description,
      goal: record.goal,
      initial_balance: record.initial_balance,
      month: record.month,
      year: record.year,
      category_id: record.category.id,
      user_id: record.user.id,
      category: record.category,
      transactions: record.transactions || [],
      created_at: record.created_at,
      updated_at: record.updated_at,
    }));
  }

  async findByIdAndUserId(
    data: MonthlyRecordRepositoryProtocol.FindByIdAndUserIdParams
  ): Promise<MonthlyRecordMock | null> {
    const monthlyRecord = await this.repository.findOne({
      where: {
        id: data.id,
        user: { id: data.userId },
      },
      relations: ["category", "transactions"],
    });

    if (!monthlyRecord) return null;

    return monthlyRecord;
  }

  async update(
    data: MonthlyRecordRepositoryProtocol.UpdateMonthlyRecord
  ): Promise<MonthlyRecordMock> {
    const monthlyRecord = await this.repository.findOne({
      where: {
        id: data.id,
        user: { id: data.userId },
      },
      relations: ["user", "category", "transactions"],
    });

    if (!monthlyRecord) {
      throw new NotFoundError(
        `Registro mensal com ID ${data.id} não encontrado para este usuário`
      );
    }

    const updatedData: Partial<MonthlyRecord> = {};

    if (data?.title) updatedData.title = data.title;
    if (data?.description) updatedData.description = data.description;
    if (data?.goal) updatedData.goal = data.goal;
    if (data?.initial_balance)
      updatedData.initial_balance = data.initial_balance;

    await this.repository.update(
      { id: data.id, user: { id: data.userId } },
      updatedData
    );

    const updatedMonthlyRecord = await this.repository.findOne({
      where: {
        id: data.id,
        user: { id: data.userId },
      },
      relations: ["category", "transactions"],
    });

    if (!updatedMonthlyRecord) {
      throw new NotFoundError(
        `Registro mensal com ID ${data.id} não encontrado após atualização`
      );
    }

    return updatedMonthlyRecord;
  }
}
