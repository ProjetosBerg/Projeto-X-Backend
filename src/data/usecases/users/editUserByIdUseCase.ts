import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import { ServerError } from "@/data/errors/ServerError";
import { BusinessRuleError } from "@/data/errors/BusinessRuleError";
import { NotFoundError } from "@/data/errors/NotFoundError";
import { EditUserByIdUseCaseProtocol } from "../interfaces/users/editUserByIdUseCaseProtocol";
import { editUserByIdValidationSchema } from "../validation/users/editUserByIdValidationSchema";
import UserAuth from "@/auth/users/userAuth";
import cloudinary from "@/config/cloudinary";
import { th } from "@faker-js/faker";
import e from "express";

export class EditUserByIdUseCase implements EditUserByIdUseCaseProtocol {
  constructor(
    private readonly userRepository: UserRepositoryProtocol,
    private readonly userAuth: UserAuth
  ) {}

  /**
   * Edita os dados de um usuário específico pelo seu ID
   * @param {EditUserByIdUseCaseProtocol.Params} data - Os dados do usuário a serem atualizados
   * @param {string} data.id - O ID do usuário a ser editado
   * @param {string} [data.name] - O novo nome do usuário (opcional)
   * @param {string} [data.email] - O novo email do usuário (opcional)
   * @param {SecurityQuestionModel[]} [data.securityQuestions] - As novas perguntas de segurança (opcional)
   * @returns {Promise<EditUserByIdUseCaseProtocol.Result>} Os dados atualizados do usuário
   * @throws {ValidationError} Se os dados fornecidos não passarem na validação
   * @throws {NotFoundError} Se o usuário não for encontrado
   * @throws {BusinessRuleError} Se o email fornecido já estiver em uso por outro usuário ou se houver falha na atualização
   * @throws {ServerError} Se ocorrer um erro inesperado durante a edição
   */
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

      const hashedSecurityQuestions = data?.securityQuestions
        ? await Promise.all(
            data.securityQuestions.map(async (sq) => ({
              question: sq.question,
              answer: await this.userAuth.hashSecurityAnswer(String(sq.answer)),
            }))
          )
        : undefined;

      if (data.publicId && user.publicId && user.publicId !== data.publicId) {
        try {
          await cloudinary.uploader.destroy(user.publicId);
          console.log(`Imagem antiga deletada: ${user.publicId}`);
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e);

          throw new ServerError(`Falha ao deletar a imagem antiga: ${message}`);
        }
      }

      const updatedUser = await this.userRepository.updateUser({
        id: data?.id,
        name: data?.name,
        email: data?.email,
        securityQuestions: hashedSecurityQuestions,
        bio: data?.bio,
        imageUrl: data?.imageUrl,
        publicId: data?.publicId,
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
