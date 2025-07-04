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
   * @param {string} user.login - Login do usuário
   * @param {string} user.email - Endereço de e-mail do usuário
   * @param {string} user.password - Senha criptografada do usuário
   * @returns {Promise<UserModel | undefined>} O usuário criado
   */
  async create(
    user: UserRepositoryProtocol.CreateParams
  ): Promise<UserModel | undefined> {
    try {
      const repository = getRepository(User);

      const newUser = repository.create({
        name: user?.name,
        login: user?.login,
        email: user?.email,
        password: user?.password,
      });

      const savedUser = await repository.save(newUser);
      return savedUser;
    } catch (error: any) {
      throw new Error(`Erro ao criar usuário: ${error.message}`);
    }
  }

  /**
   * Busca um usuário por ID ou e-mail
   * @param {UserRepositoryProtocol.FindOneParams} data - Os critérios de busca
   * @param {string} [data.id] - ID do usuário (opcional)
   * @param {string} [data.login] - Login do usuário (opcional)
   * @param {string} [data.email] - E-mail do usuário (opcional)
   * @returns {Promise<UserModel | null>} O usuário encontrado ou null
   */
  async findOne(
    data: UserRepositoryProtocol.FindOneParams
  ): Promise<UserModel | null> {
    try {
      const repository = getRepository(User);
      const user = await repository.findOne({ where: data });
      return user;
    } catch (error) {
      return null;
    }
  }
}
