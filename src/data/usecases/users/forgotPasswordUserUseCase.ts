import { UserModel } from "@/domain/models/postgres/UserModel";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import UserAuth from "@/auth/users/userAuth";
import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { ForgotPasswordUserUseCaseProtocol } from "../interfaces/forgotPasswordUseCaseProtocol";
import { forgotPasswordUserValidationSchema } from "../validation/forgotPasswordUserValidationSchema";

export class ForgotPasswordUserUseCase
  implements ForgotPasswordUserUseCaseProtocol
{
  constructor(
    private readonly userRepository: UserRepositoryProtocol,
    private readonly userAuth: UserAuth
  ) {}

  async handle(
    data: ForgotPasswordUserUseCaseProtocol.Params
  ): Promise<ForgotPasswordUserUseCaseProtocol.Result> {
    try {
      await forgotPasswordUserValidationSchema.validate(data, {
        abortEarly: false,
      });
      const user = await this.userRepository.findOne({ login: data.login });
      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }

      if (!user.security_questions || user.security_questions.length === 0) {
        throw new BusinessRuleError(
          "Nenhuma questão de segurança registrada para este usuário"
        );
      }

      const questions = data?.securityQuestions;
      if (questions.length !== user.security_questions.length) {
        throw new BusinessRuleError(
          "Número de questões de segurança fornecidas não corresponde ao registrado"
        );
      }

      for (const provided of questions) {
        const stored = user.security_questions.find(
          (q) => q.question === provided.question
        );
        if (!stored || stored.answer !== provided.answer) {
          throw new BusinessRuleError("Resposta de segurança inválida");
        }
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
