import { UserMonthlyEntryRank } from "@/domain/entities/postgres/UserMonthlyEntryRank";
import { Authentication } from "@/domain/entities/postgres/Authentication";
import { Between, getRepository } from "typeorm";
import { UserMonthlyEntryRankRepositoryProtocol } from "../interfaces/userMonthlyEntryRankRepositoryProtocol";

export class UserMonthlyEntryRankRepository
  implements UserMonthlyEntryRankRepositoryProtocol
{
  constructor() {}

  /**
   * Atualiza o total de entradas para um usuário em um mês/ano específico, calculando a soma de entryCount das autenticações nesse período.
   * @param {Object} data - Dados para atualização
   * @param {string} data.userId - ID do usuário
   * @param {number} data.year - Ano (ex.: 2025)
   * @param {number} data.month - Mês (1-12)
   * @returns {Promise<UserMonthlyEntryRank>} O registro atualizado ou criado
   */
  async updateTotalForUserAndMonth(data: {
    userId: string;
    year: number;
    month: number;
  }): Promise<UserMonthlyEntryRank> {
    try {
      const startOfMonth = new Date(data.year, data.month - 1, 1);
      const endOfMonth = new Date(data.year, data.month, 0, 23, 59, 59, 999);

      const authRepo = getRepository(Authentication);
      const sumResult = await authRepo
        .createQueryBuilder("auth")
        .select("SUM(auth.entryCount)", "total")
        .where("auth.userId = :userId", { userId: data.userId })
        .andWhere("auth.loginAt BETWEEN :start AND :end", {
          start: startOfMonth,
          end: endOfMonth,
        })
        .getRawOne();

      const totalEntries = parseInt(sumResult?.total) || 0;

      const rankRepo = getRepository(UserMonthlyEntryRank);
      let rank = await rankRepo.findOne({
        where: { userId: data.userId, year: data.year, month: data.month },
      });

      if (!rank) {
        rank = rankRepo.create({
          userId: data.userId,
          year: data.year,
          month: data.month,
          totalEntries,
        });
      } else {
        rank.totalEntries = totalEntries;
      }

      return await rankRepo.save(rank);
    } catch (error: any) {
      throw new Error(
        `Erro ao atualizar total mensal de entradas: ${error.message}`
      );
    }
  }

  /**
   * Obtém a lista de todos os usuários ranqueados por total de entradas em um mês/ano específico (descendente).
   * @param {Object} data - Dados para o rank
   * @param {number} data.year - Ano
   * @param {number} data.month - Mês (1-12)
   * @returns {Promise<{userId: string, totalEntries: number, rank: number}[]>} Lista ranqueada
   */
  async getAllRankedForMonth(data: {
    year: number;
    month: number;
  }): Promise<{ userId: string; totalEntries: number; rank: number }[]> {
    try {
      const rankRepo = getRepository(UserMonthlyEntryRank);
      const ranks = await rankRepo.find({
        where: { year: data.year, month: data.month },
        order: { totalEntries: "DESC" },
      });

      const ranked: { userId: string; totalEntries: number; rank: number }[] =
        [];
      let currentRank = 1;
      let prevTotal = -1;

      for (const r of ranks) {
        if (r.totalEntries !== prevTotal) {
          currentRank = ranked.length + 1;
          prevTotal = r.totalEntries;
        }
        ranked.push({
          userId: r.userId,
          totalEntries: r.totalEntries,
          rank: currentRank,
        });
      }

      return ranked;
    } catch (error: any) {
      throw new Error(`Erro ao obter ranking mensal: ${error.message}`);
    }
  }

  /**
   * Obtém o rank de um usuário específico em um mês/ano.
   * @param {Object} data - Dados para o rank
   * @param {string} data.userId - ID do usuário
   * @param {number} data.year - Ano
   * @param {number} data.month - Mês (1-12)
   * @returns {Promise<number | undefined>} O rank ou undefined se não existir
   */
  async getUserRankForMonth(data: {
    userId: string;
    year: number;
    month: number;
  }): Promise<number | undefined> {
    try {
      const rankRepo = getRepository(UserMonthlyEntryRank);
      const userRank = await rankRepo.findOne({
        where: { userId: data.userId, year: data.year, month: data.month },
      });
      if (!userRank) return undefined;

      const higherCount = await rankRepo
        .createQueryBuilder("rank")
        .where("rank.year = :year", { year: data.year })
        .andWhere("rank.month = :month", { month: data.month })
        .andWhere("rank.totalEntries > :total", {
          total: userRank.totalEntries,
        })
        .getCount();

      return higherCount + 1;
    } catch (error: any) {
      throw new Error(`Erro ao obter rank mensal do usuário: ${error.message}`);
    }
  }

  /**
   * Encontra usuários que perderam posições no rank em comparação com o mês anterior.
   * @param {Object} data - Dados para a verificação
   * @param {number} data.year - Ano atual
   * @param {number} data.month - Mês atual (1-12)
   * @returns {Promise<{ userId: string; positionsLost: number; currentPosition: number }[]>} Lista de usuários que perderam posições
   */
  async findUsersWhoLostPositions(data: {
    year: number;
    month: number;
  }): Promise<
    { userId: string; positionsLost: number; currentPosition: number }[]
  > {
    try {
      // Calcular mês/ano anterior
      let prevYear = data.year;
      let prevMonth = data.month - 1;
      if (prevMonth === 0) {
        prevMonth = 12;
        prevYear -= 1;
      }

      const currentRanks = await this.getAllRankedForMonth({
        year: data.year,
        month: data.month,
      });

      const previousRanks = await this.getAllRankedForMonth({
        year: prevYear,
        month: prevMonth,
      });

      const prevRankMap = new Map<string, number>();
      previousRanks.forEach((r) => {
        prevRankMap.set(r.userId, r.rank);
      });

      const lostPositions: {
        userId: string;
        positionsLost: number;
        currentPosition: number;
      }[] = [];

      currentRanks.forEach((current) => {
        const prevRank = prevRankMap.get(current.userId);
        if (prevRank !== undefined && current.rank > prevRank) {
          // Rank maior significa posição pior
          const positionsLost = current.rank - prevRank;
          lostPositions.push({
            userId: current.userId,
            positionsLost,
            currentPosition: current.rank,
          });
        }
      });

      return lostPositions;
    } catch (error: any) {
      throw new Error(
        `Erro ao encontrar usuários que perderam posições: ${error.message}`
      );
    }
  }
}
