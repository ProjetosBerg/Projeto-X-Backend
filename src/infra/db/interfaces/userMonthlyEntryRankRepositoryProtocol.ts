import { UserMonthlyEntryRank } from "@/domain/entities/postgres/UserMonthlyEntryRank";
import { UserMonthlyEntryRankModel } from "@/domain/models/postgres/UserMonthlyEntryRankModel";

export interface UserMonthlyEntryRankRepositoryProtocol {
  /**
   * Atualiza o total de entradas para um usuário em um mês/ano específico
   */
  updateTotalForUserAndMonth(
    data: UserMonthlyEntryRankRepositoryProtocol.UpdateTotalForUserAndMonthParams
  ): Promise<UserMonthlyEntryRank>;

  /**
   * Obtém a lista de todos os usuários ranqueados por total de entradas em um mês/ano específico
   */
  getAllRankedForMonth(
    data: UserMonthlyEntryRankRepositoryProtocol.GetAllRankedForMonthParams
  ): Promise<{ userId: string; totalEntries: number; rank: number }[]>;

  /**
   * Obtém o rank de um usuário específico em um mês/ano
   */
  getUserRankForMonth(
    data: UserMonthlyEntryRankRepositoryProtocol.GetUserRankForMonthParams
  ): Promise<number | undefined>;

  /**
   * Encontra usuários que perderam posições no rank em comparação com o processamento anterior.
   * Compara o ranking atual do mês (até agora) com o ranking do mês até o horário anterior.
   */
  findUsersWhoLostPositions(
    data: UserMonthlyEntryRankRepositoryProtocol.FindUsersWhoLostPositionsParams
  ): Promise<
    { userId: string; positionsLost: number; currentPosition: number }[]
  >;

  /**
   * Atualiza a última notificação de perda de posição
   */
  updateLastPositionLossNotification(
    data: UserMonthlyEntryRankRepositoryProtocol.UpdateLastPositionLossNotificationParams
  ): Promise<void>;

  /**
   * Verifica se o usuário já foi notificado sobre perda de posição recentemente
   */
  wasRecentlyNotified(
    data: UserMonthlyEntryRankRepositoryProtocol.WasRecentlyNotifiedParams
  ): Promise<boolean>;
}

export namespace UserMonthlyEntryRankRepositoryProtocol {
  export type UpdateTotalForUserAndMonthParams = {
    userId: UserMonthlyEntryRankModel["userId"];
    year: UserMonthlyEntryRankModel["year"];
    month: UserMonthlyEntryRankModel["month"];
  };

  export type GetAllRankedForMonthParams = {
    year: UserMonthlyEntryRankModel["year"];
    month: UserMonthlyEntryRankModel["month"];
  };

  export type GetUserRankForMonthParams = {
    userId: UserMonthlyEntryRankModel["userId"];
    year: UserMonthlyEntryRankModel["year"];
    month: UserMonthlyEntryRankModel["month"];
  };

  export type FindUsersWhoLostPositionsParams = {
    year: UserMonthlyEntryRankModel["year"];
    month: UserMonthlyEntryRankModel["month"];
    currentTime: Date;
    userId: UserMonthlyEntryRankModel["userId"];
    previousRanks: { userId: string; rank: number }[];
  };

  export type UpdateLastPositionLossNotificationParams = {
    userId: UserMonthlyEntryRankModel["userId"];
    year: UserMonthlyEntryRankModel["year"];
    month: UserMonthlyEntryRankModel["month"];
    currentRank: number;
    notifiedAt: Date;
  };

  export type WasRecentlyNotifiedParams = {
    userId: UserMonthlyEntryRankModel["userId"];
    year: UserMonthlyEntryRankModel["year"];
    month: UserMonthlyEntryRankModel["month"];
    currentRank: number;
    timeWindowMinutes?: number;
  };
}
