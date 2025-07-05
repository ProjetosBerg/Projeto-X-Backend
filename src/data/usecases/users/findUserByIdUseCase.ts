import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { FindUserByIdUseCaseProtocol } from "../interfaces/findUserByIdUseCaseProtocol";
import { findUserByIdValidationSchema } from "../validation/findUserByIdValidationSchema";

export class FindUserByIdUseCase implements FindUserByIdUseCaseProtocol {
  constructor(private readonly userRepository: UserRepositoryProtocol) {}

  async handle(
    data: FindUserByIdUseCaseProtocol.Params
  ): Promise<FindUserByIdUseCaseProtocol.Result> {
    try {
      await findUserByIdValidationSchema.validate(data, {
        abortEarly: false,
      });

      const user = await this.userRepository.findOne({ id: data?.id });
      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }

      if (!user?.security_questions || user?.security_questions.length === 0) {
        throw new BusinessRuleError(
          "Nenhuma questão de segurança registrada para este usuário"
        );
      }
      return { user };
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
      throw new ServerError(
        `Falha na Busca do Usuário pelo Id: ${errorMessage}`
      );
    }
  }
}
