import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ITokenPayload, IUser, IUserAuth } from "@/auth/interface/IUserAuth";

class UserAuth implements IUserAuth {
  private readonly JWT_SECRET: string =
    process.env.JWT_SECRET || "your-secret-key";

  /**
   * Cria um token JWT para um usuário
   * @param {IUser} user - Os dados do usuário para criação do token
   * @param {string} user.id - Identificador único do usuário
   * @param {string} user.name - Nome do usuário
   * @param {string} user.email - Endereço de e-mail do usuário
   * @returns {Promise<{ message: string; token: string; userId: string }>} Mensagem de autenticação, token e ID do usuário
   */
  async createUserToken(
    user: IUser
  ): Promise<{ message: string; token: string; userId: string }> {
    try {
      const payload: ITokenPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign(payload, this.JWT_SECRET, { expiresIn: "1h" });
      return {
        message: "Você está autenticado",
        token,
        userId: user.id,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Falha ao criar token: ${errorMessage}`);
    }
  }

  /**
   * Extrai o token do cabeçalho de autorização
   * @param {{ authorization?: string }} headers - Cabeçalhos da requisição contendo o token de autorização
   * @param {string} [headers.authorization] - Cabeçalho de autorização com o token Bearer
   * @returns {string | null} O token extraído ou null se inválido ou ausente
   */
  getToken(headers: { authorization?: string }): string | null {
    if (!headers.authorization) return null;

    const parts = headers.authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;

    return parts[1];
  }

  /**
   * Recupera os dados do usuário a partir de um token válido
   * @param {string} token - O token JWT a ser decodificado
   * @returns {Promise<ITokenPayload | null>} Os dados do usuário decodificados ou null se inválido
   */
  async getUserByToken(token: string): Promise<ITokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as ITokenPayload;
      return {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica a validade de um token
   * @param {string} token - O token JWT a ser verificado
   * @returns {Promise<boolean>} True se o token for válido, false caso contrário
   */
  async checkToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, this.JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Gera o hash de uma senha utilizando bcrypt
   * @param {string} password - A senha
   * @returns {Promise<string>} A senha criptografada (hash)
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compara uma senha em texto plano com uma senha criptografada
   * @param {string} password - A senha
   * @param {string} hashedPassword - A senha criptografada para comparação
   * @returns {Promise<boolean>} True se as senhas forem iguais, false caso contrário
   */
  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export default UserAuth;
