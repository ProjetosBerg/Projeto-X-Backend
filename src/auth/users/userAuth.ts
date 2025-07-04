import * as jwt from "jsonwebtoken";
import { ITokenPayload, IUser, IUserAuth } from "@/auth/interface/IUserAuth";

class UserAuth implements IUserAuth {
  private readonly JWT_SECRET: string =
    process.env.JWT_SECRET || "your-secret-key";
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
      throw new Error(`Failed to create token: ${errorMessage}`);
    }
  }

  getToken(headers: { authorization?: string }): string | null {
    if (!headers.authorization) return null;

    const parts = headers.authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") return null;

    return parts[1];
  }

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

  async checkToken(token: string): Promise<boolean> {
    try {
      jwt.verify(token, this.JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }
}

export default UserAuth;
