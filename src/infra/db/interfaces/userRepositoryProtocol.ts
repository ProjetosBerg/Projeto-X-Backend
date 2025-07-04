import { UserModel } from "@/domain/models/postgres/UserModel";

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
    password: UserModel["password"];
  };

  export type FindOneParams = {
    id?: UserModel["id"];
    email?: UserModel["email"];
  };
}
