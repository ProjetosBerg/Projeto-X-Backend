// src/infra/db/interfaces/authenticationRepositoryProtocol.ts
import { Authentication } from "@/domain/entities/postgres/Authentication";

export interface AuthenticationRepositoryProtocol {
  /**
   * Verifica se usuário já logou hoje
   */
  hasLoginToday(data: { userId: string; date: Date }): Promise<boolean>;

  /**
   * Busca uma sessão ativa (sem logout)
   */
  findActiveSession(data: {
    userId: string;
    sessionId: string;
  }): Promise<Authentication | undefined>;

  /**
   * Cria um novo registro de autenticação
   */
  create(
    data: AuthenticationRepositoryProtocol.CreateParams
  ): Promise<Authentication | undefined>;

  /**
   * Atualiza o logout de uma sessão
   */
  updateLogout(
    data: AuthenticationRepositoryProtocol.UpdateLogoutParams
  ): Promise<Authentication | undefined>;

  /**
   * Busca autenticações por usuário e período
   */
  findByUserAndPeriod(
    data: AuthenticationRepositoryProtocol.FindByUserAndPeriodParams
  ): Promise<Authentication[]>;

  /**
   * Conta sessões por dia
   */
  countSessionsByDay(
    data: AuthenticationRepositoryProtocol.CountSessionsByDayParams
  ): Promise<number>;

  /**
   * Verifica se há login ofensivo no dia
   */
  hasOffensiveLoginInDay(
    data: AuthenticationRepositoryProtocol.HasOffensiveLoginInDayParams
  ): Promise<boolean>;
}

export namespace AuthenticationRepositoryProtocol {
  export type CreateParams = {
    userId: string;
    loginAt?: Date;
    sessionId: string;
    isOffensive: boolean;
  };

  export type UpdateLogoutParams = {
    sessionId: string;
    logoutAt?: Date;
  };

  export type FindByUserAndPeriodParams = {
    userId: string;
    startDate?: Date;
    endDate?: Date;
    onlyOffensive?: boolean;
  };

  export type CountSessionsByDayParams = {
    userId: string;
    date: Date;
  };

  export type HasOffensiveLoginInDayParams = {
    userId: string;
    date: Date;
  };
}
