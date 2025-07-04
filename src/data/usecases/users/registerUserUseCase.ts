import { UserModel } from "@/domain/models/postgres/UserModel";
import { userValidationSchema } from "../validation/userValidationSchema";
import { RegisterUserUseCaseProtocol } from "../interfaces/registerUserUseCaseProtocol";
import { UserRepositoryProtocol } from "@/infra/db/interfaces/userRepositoryProtocol";
import UserAuth from "@/auth/users/userAuth";

export class RegisterUserUseCase implements RegisterUserUseCaseProtocol {
  constructor(
    private readonly userRepository: UserRepositoryProtocol,
    private readonly userAuth: UserAuth
  ) {}
  /**
   * Realiza o cadastro de um usuário com os dados fornecidos
   * @param {RegisterUserUseCaseProtocol.Params} data - Os dados de registro do usuário
   * @param {string} data.name - O nome do usuário
   * @param {string} data.email - O endereço de email do usuário
   * @param {string} data.password - A senha da conta do usuário
   * @param {string} data.confirmpassword - A confirmação da senha do usuário
   * @returns {Promise<RegisterUserUseCaseProtocol.Result | undefined>} O usuário registrado e o token de autenticação
   */
  async handle(
    data: RegisterUserUseCaseProtocol.Params
  ): Promise<RegisterUserUseCaseProtocol.Result | undefined> {
    try {
      await userValidationSchema.validate(data, { abortEarly: false });

      const existingEmailUser = await this.userRepository.findOne({
        email: data.email,
      });

      if (existingEmailUser) {
        throw new Error(
          "Já existe um usuário cadastrado com este endereço de email"
        );
      }

      const existingLogin = await this.userRepository.findOne({
        login: data.login,
      });

      if (existingLogin) {
        throw new Error("Já existe um usuário cadastrado com este login");
      }

      const hashedPassword = await this.userAuth.hashPassword(data?.password);

      const newUser: UserModel | undefined = await this.userRepository.create({
        name: data?.name,
        login: data?.login,
        email: data?.email,
        password: hashedPassword,
      });

      if (!newUser || !newUser.id) {
        throw new Error("Falha ao criar usuário no banco de dados");
      }

      const { token } = await this.userAuth.createUserToken({
        id: newUser?.id,
        login: newUser?.login,
        name: newUser?.name,
        email: newUser?.email,
      });

      if (!token) {
        throw new Error("Falha ao gerar token de autenticação para o usuário");
      }

      return {
        user: newUser,
        token,
      };
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw error;
      }

      const errorMessage =
        error.message || "Erro interno do servidor durante o cadastro";
      throw new Error(`Falha no cadastro do usuário: ${errorMessage}`);
    }
  }
}
