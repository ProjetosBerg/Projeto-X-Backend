import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import UserAuth from "@/auth/users/userAuth";
import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { resetPasswordUserValidationSchema } from "../validation/users/resetPasswordUserValidationSchema";
import { ResetPasswordUserUseCaseProtocol } from "../interfaces/users/resetPasswordUseCaseProtocol";

export class ResetPasswordUserUseCase
  implements ResetPasswordUserUseCaseProtocol
{
  constructor(
    private readonly userRepository: UserRepositoryProtocol,
    private readonly userAuth: UserAuth
  ) {}

  /**
   * Redefine a senha de um usuário através da validação das perguntas de segurança
   * @param {ForgotPasswordUserUseCaseProtocol.Params} data - Os dados necessários para redefinir a senha
   * @param {string} data.login - O login do usuário que deseja redefinir a senha
   * @param {string} data.newPassword - A nova senha a ser definida
   * @param {string} data.oldPassword - A senha antiga
   * @param {string} data.confirmNewPassword - A confirmação da nova senha
   * @returns {Promise<ForgotPasswordUserUseCaseProtocol.Result>} Mensagem de confirmação da redefinição da senha
   * @throws {ValidationError} Se os dados fornecidos não passarem na validação
   * @throws {NotFoundError} Se o usuário não for encontrado
   * @throws {BusinessRuleError} Se o usuário não possuir perguntas de segurança, se o número de questões não corresponder, se as respostas estiverem incorretas ou se houver falha na atualização
   * @throws {ServerError} Se ocorrer um erro inesperado durante a redefinição
   */
  async handle(
    data: ResetPasswordUserUseCaseProtocol.Params
  ): Promise<ResetPasswordUserUseCaseProtocol.Result> {
    try {
      await resetPasswordUserValidationSchema.validate(data, {
        abortEarly: false,
      });
      const user = await this.userRepository.findOne({ login: data.login });
      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }
      const isOldPasswordValid = await this.userAuth.comparePassword(
        data.oldPassword,
        user.password
      );
      if (!isOldPasswordValid) {
        throw new BusinessRuleError("Senha antiga incorreta");
      }

      const hashedPassword = await this.userAuth.hashPassword(
        data?.newPassword
      );

      const updatedUser = await this.userRepository.updatePassword({
        id: user.id,
        password: hashedPassword,
      });

      if (!updatedUser) {
        throw new BusinessRuleError("Falha ao atualizar a senha do usuário");
      }

      return { message: "Senha redefinida com sucesso" };
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
        error.message ||
        "Erro interno do servidor durante a redefinição de senha";
      throw new ServerError(`Falha na redefinição de senha: ${errorMessage}`);
    }
  }
}
