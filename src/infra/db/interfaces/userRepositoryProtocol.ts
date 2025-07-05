import { UserModel } from "@/domain/models/postgres/UserModel";
import { SecurityQuestionModel } from "@/domain/models/postgres/SecurityQuestionModel";

export interface UserRepositoryProtocol {
  create(
    data: UserRepositoryProtocol.CreateParams
  ): Promise<UserModel | undefined>;
  findOne(
    data: UserRepositoryProtocol.FindOneParams
  ): Promise<UserModel | null>;
}

export namespace UserRepositoryProtocol {
  export type CreateParams = {
    email: UserModel["email"];
    name: UserModel["name"];
    login: UserModel["login"];
    password: UserModel["password"];
    securityQuestions: Array<{
      question: SecurityQuestionModel["question"];
      answer: SecurityQuestionModel["answer"];
    }>;
  };

  export type FindOneParams = {
    id?: UserModel["id"];
    login?: UserModel["login"];
    email?: UserModel["email"];
  };
}
