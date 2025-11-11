// src/data/usecases/users/validateTokenUseCase.ts
import { ServerError } from "@/data/errors/ServerError";
import { AuthenticationRepositoryProtocol } from "@/infra/db/interfaces/authenticationRepositoryProtocol";
import { v4 as uuidv4 } from "uuid";
import { ValidateTokenUseCaseProtocol } from "../interfaces/users/validateTokenUseCaseProtocol";

export class ValidateTokenUseCase implements ValidateTokenUseCaseProtocol {
  constructor(
    private readonly authenticationRepository: AuthenticationRepositoryProtocol
  ) {}

  /**
   * Valida o token e registra a presença diária do usuário
   * Cria um novo registro APENAS se for o primeiro acesso do dia
   * Isso permite rastrear streak/ofensiva e presença diária
   * @param {ValidateTokenUseCaseProtocol.Params} data - Dados do user do token
   * @param {string} data.userId - ID do usuário
   * @param {string} [data.sessionId] - ID da sessão do token (opcional)
   * @returns {Promise<ValidateTokenUseCaseProtocol.Result>} Dados do user e sessionId
   * @throws {ServerError} Se ocorrer um erro inesperado
   */
  async handle(
    data: ValidateTokenUseCaseProtocol.Params
  ): Promise<ValidateTokenUseCaseProtocol.Result> {
    try {
      const sessionId = data.sessionId || uuidv4();
      const now = new Date();
      const isOffensive = now.getHours() < 12;

      const hasLoginToday = await this.authenticationRepository.hasLoginToday({
        userId: data.userId,
        date: now,
      });

      if (hasLoginToday) {
        return {
          valid: true,
          sessionId,
        };
      }

      await this.authenticationRepository.create({
        userId: data.userId,
        loginAt: now,
        sessionId,
        isOffensive,
      });

      return {
        valid: true,
        sessionId,
      };
    } catch (error: any) {
      const errorMessage =
        error.message || "Erro interno do servidor durante validação de token";
      console.error("Erro na validação do token:", errorMessage);
      throw new ServerError(`Falha na validação do token: ${errorMessage}`);
    }
  }
}
