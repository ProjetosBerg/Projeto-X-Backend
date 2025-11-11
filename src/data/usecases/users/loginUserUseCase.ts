import { v4 as uuidv4 } from "uuid";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import UserAuth from "@/auth/users/userAuth";
import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { LoginUserUseCaseProtocol } from "@/data/usecases/interfaces/users/loginUserUseCaseProtocol";
import { loginUserValidationSchema } from "@/data/usecases/validation/users/loginUserValidationSchema";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { AuthenticationRepositoryProtocol } from "@/infra/db/interfaces/authenticationRepositoryProtocol";

export class LoginUserUseCase implements LoginUserUseCaseProtocol {
  constructor(
    private readonly userRepository: UserRepositoryProtocol,
    private readonly userAuth: UserAuth,
    private readonly authenticationRepository: AuthenticationRepositoryProtocol
  ) {}

  /**
   * Autentica um usuário e gera um token JWT após um login bem-sucedido
   * Além disso, gerencia sessões ativas do dia: reutiliza se existir, incrementando entryCount
   * (exceto se a última entrada foi há menos de 1 minuto); cria nova se não
   * Isso permite múltiplos logins no mesmo dia (ex.: diferentes navegadores) sem duplicar sessões, rastreando acessos
   * @param {LoginUserUseCaseProtocol.Params} data - As credenciais de login
   * @param {string} [data.login] - O login do usuário (opcional se o email for fornecido)
   * @param {string} data.password - A senha do usuário
   * @returns {Promise<LoginUserUseCaseProtocol.Result>} Resultado da autenticação com o token e os dados do usuário
   * @throws {BusinessRuleError} Se as credenciais forem inválidas
   * @throws {NotFoundError} Se o usuário não for encontrado
   * @throws {ServerError} Se ocorrer um erro inesperado
   */

  async handle(
    data: LoginUserUseCaseProtocol.Params
  ): Promise<LoginUserUseCaseProtocol.Result> {
    try {
      await loginUserValidationSchema.validate(data, { abortEarly: false });

      const user = await this.userRepository.findOne({
        login: data.login,
      });

      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }

      const isPasswordValid = await this.userAuth.comparePassword(
        data.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new BusinessRuleError("Senha incorreta");
      }

      const now = new Date();

      const activeSessionToday =
        await this.authenticationRepository.findActiveSessionToday({
          userId: user.id!,
          date: now,
        });

      let sessionId: string;
      const isOffensive = now.getHours() < 12;

      if (activeSessionToday) {
        sessionId = activeSessionToday.sessionId;

        const timeSinceLastEntry =
          now.getTime() - new Date(activeSessionToday.lastEntryAt).getTime();
        const isWithinOneMinute = timeSinceLastEntry < 60000;

        if (!isWithinOneMinute) {
          await this.authenticationRepository.incrementEntryCount({
            userId: user.id!,
            sessionId,
            now,
          });
        }
      } else {
        sessionId = uuidv4();
        await this.authenticationRepository.create({
          userId: user.id!,
          loginAt: now,
          sessionId,
          isOffensive,
        });
      }

      const authResult = await this.userAuth.createUserToken({
        id: user.id!,
        name: user.name,
        login: user.login,
        email: user.email,
        sessionId,
      });

      return authResult;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      if (
        error instanceof BusinessRuleError ||
        error instanceof NotFoundError
      ) {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante o login";
      throw new ServerError(`Falha no login do usuário: ${errorMessage}`);
    }
  }
}
