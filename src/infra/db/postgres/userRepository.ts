import { UserModel } from "@/domain/models/postgres/UserModel";
import { User } from "@/domain/entities/postgres/User";
import { getRepository } from "typeorm";
import { UserRepositoryProtocol } from "../interfaces/userRepositoryProtocol";

export class UserRepository implements UserRepositoryProtocol {
  constructor() {}

  /**
   * Cria um novo usuário no banco de dados
   * @param {UserRepositoryProtocol.CreateParams} user - Os dados do usuário a serem criados
   * @param {string} user.name - Nome do usuário
   * @param {string} user.email - Endereço de e-mail do usuário
   * @param {string} user.password - Senha criptografada do usuário
   * @returns {Promise<UserModel | undefined>} O usuário criado
   */
  async create(
    user: UserRepositoryProtocol.CreateParams
  ): Promise<UserModel | undefined> {
    try {
      const repository = getRepository(User);

      console.log("repository", repository);

      const newUser = repository.create({
        name: user.name,
        email: user.email,
        password: user.password,
      });

      console.log("newUser", newUser);

      const savedUser = await repository.save(newUser);
      console.log("savedUser", savedUser);
      return savedUser;
    } catch (error: any) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  /**
   * Busca um usuário por ID ou e-mail
   * @param {UserRepositoryProtocol.FindOneParams} data - Os critérios de busca
   * @param {string} [data.id] - ID do usuário (opcional)
   * @param {string} [data.email] - E-mail do usuário (opcional)
   * @returns {Promise<UserModel | null>} O usuário encontrado ou null
   */
  async findOne(
    data: UserRepositoryProtocol.FindOneParams
  ): Promise<UserModel | null> {
    try {
      if (data.email) {
        return getRepository(User).findOne({ where: { email: data?.email } });
      }
      return getRepository(User).findOne({ where: { id: data?.id } });
    } catch (error) {
      return null;
    }
  }
}
