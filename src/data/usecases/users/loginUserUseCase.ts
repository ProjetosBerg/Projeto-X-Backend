import { UserModel } from "@/domain/models/postgres/UserModel";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import UserAuth from "@/auth/users/userAuth";
import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { LoginUserUseCaseProtocol } from "@/data/usecases/interfaces/users/loginUserUseCaseProtocol";
import { loginUserValidationSchema } from "@/data/usecases/validation/users/loginUserValidationSchema";
import { NotFoundError } from "@/data/errors/NotFoundError";

export class LoginUserUseCase implements LoginUserUseCaseProtocol {
  constructor(
    private readonly userRepository: UserRepositoryProtocol,
    private readonly userAuth: UserAuth
  ) {}

  /**
   * Autentica um usuário e gera um token JWT após um login bem-sucedido
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

      const authResult = await this.userAuth.createUserToken({
        id: user.id!,
        name: user.name,
        login: user.login,
        email: user.email,
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
        error.message || "Erro interno do servidor durante o cadastro";
      throw new ServerError(`Falha no login do usuário: ${errorMessage}`);
    }
  }
}
