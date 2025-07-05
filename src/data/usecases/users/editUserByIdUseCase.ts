import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { EditUserByIdUseCaseProtocol } from "../interfaces/editUserByIdUseCaseProtocol";
import { editUserByIdValidationSchema } from "../validation/editUserByIdValidationSchema";

export class EditUserByIdUseCase implements EditUserByIdUseCaseProtocol {
  constructor(private readonly userRepository: UserRepositoryProtocol) {}

  async handle(
    data: EditUserByIdUseCaseProtocol.Params
  ): Promise<EditUserByIdUseCaseProtocol.Result> {
    try {
      await editUserByIdValidationSchema.validate(data, {
        abortEarly: false,
      });

      const user = await this.userRepository.findOne({ id: data.id });
      if (!user) {
        throw new NotFoundError("Usuário não encontrado");
      }

      if (data?.email && data?.email !== user?.email) {
        const existingUser = await this.userRepository.findOne({
          email: data.email,
        });
        if (existingUser && existingUser.id !== data.id) {
          throw new BusinessRuleError("O email fornecido já está em uso");
        }
      }

      const updatedUser = await this.userRepository.updateUser({
        id: data?.id,
        name: data?.name,
        email: data?.email,
        securityQuestions: data?.securityQuestions?.map((sq) => ({
          question: sq.question,
          answer: sq.answer,
        })),
      });

      if (!updatedUser) {
        throw new BusinessRuleError("Falha ao atualizar os dados do usuário");
      }

      return updatedUser;
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
        error.message || "Erro interno do servidor durante a edição do usuário";
      throw new ServerError(`Falha na edição do usuário: ${errorMessage}`);
    }
  }
}
