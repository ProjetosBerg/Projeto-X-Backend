import { ServerError } from "@/data/errors/ServerError";
import { AuthenticationRepositoryProtocol } from "@/infra/db/interfaces/authenticationRepositoryProtocol";
import { v4 as uuidv4 } from "uuid";
import { ValidateTokenUseCaseProtocol } from "../interfaces/users/validateTokenUseCaseProtocol";

export class ValidateTokenUseCase implements ValidateTokenUseCaseProtocol {
  constructor(
    private readonly authenticationRepository: AuthenticationRepositoryProtocol
  ) {}

  /**
   * Valida o token e registra a presença/entrada do usuário
   * Para sessões existentes e ativas do DIA ATUAL, incrementa o entryCount e atualiza lastEntryAt
   * (exceto se a última entrada foi há menos de 1 minuto)
   * Para novas sessões ou sessões ativas de dias anteriores, cria um novo registro
   * Isso permite rastrear streak/ofensiva, presença diária e contagem de entradas por dia (via soma de entryCount)
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
      let sessionId = data.sessionId || uuidv4();
      const now = new Date();

      const activeSession =
        await this.authenticationRepository.findActiveSession({
          userId: data.userId,
          sessionId,
        });

      let shouldCreateNew = true;

      if (activeSession) {
        const isToday = this.isSameDay(activeSession.loginAt, now);
        if (isToday) {
          const timeSinceLastEntry =
            now.getTime() - new Date(activeSession.lastEntryAt).getTime();
          const isWithinOneMinute = timeSinceLastEntry < 60000;

          if (!isWithinOneMinute) {
            await this.authenticationRepository.incrementEntryCount({
              userId: data.userId,
              sessionId,
              now,
            });
          }
          shouldCreateNew = false;
        }
      }

      if (shouldCreateNew) {
        if (!data.sessionId) {
          sessionId = uuidv4();
        }
        const isOffensive = now.getHours() < 12;

        await this.authenticationRepository.create({
          userId: data.userId,
          loginAt: now,
          sessionId,
          isOffensive,
        });
      }

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

  /**
   * Verifica se duas datas são do mesmo dia (ignorando hora/minutos)
   * @private
   */
  private isSameDay(date1: Date, date2: Date): boolean {
    const d1 = new Date(date1);
    d1.setHours(0, 0, 0, 0);
    const d2 = new Date(date2);
    d2.setHours(0, 0, 0, 0);
    return d1.getTime() === d2.getTime();
  }
}
