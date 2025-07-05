import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { FindQuestionsUserUseCaseProtocol } from "../interfaces/findQuestionsUserUseCaseProtocol";
import { findQuestionsUserValidationSchema } from "../validation/users/findQuestionsUserValidationSchema";

export class FindQuestionsUserUseCase
  implements FindQuestionsUserUseCaseProtocol
{
  constructor(private readonly userRepository: UserRepositoryProtocol) {}

  async handle(
    data: FindQuestionsUserUseCaseProtocol.Params
  ): Promise<FindQuestionsUserUseCaseProtocol.Result> {
    try {
      await findQuestionsUserValidationSchema.validate(data, {
        abortEarly: false,
      });

      const user = await this.userRepository.findOne({ login: data.login });
      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }

      if (!user?.security_questions || user?.security_questions.length === 0) {
        throw new BusinessRuleError(
          "Nenhuma questão de segurança registrada para este usuário"
        );
      }

      const securityQuestions = user?.security_questions.map((q) => ({
        question: q.question,
      }));
      return { securityQuestions };
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
      throw new ServerError(`Falha na Busca de Questões: ${errorMessage}`);
    }
  }
}
