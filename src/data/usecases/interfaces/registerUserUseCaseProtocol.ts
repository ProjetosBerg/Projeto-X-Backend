import { UserModel } from "@/domain/models/postgres/UserModel";

export interface RegisterUserUseCaseProtocol {
  handle(
    data: RegisterUserUseCaseProtocol.Params
  ): Promise<RegisterUserUseCaseProtocol.Result | undefined>;
}

export namespace RegisterUserUseCaseProtocol {
  export type Params = {
    name: UserModel["name"];
    login: UserModel["login"];
    email: UserModel["email"];
    password: UserModel["password"];
    confirmpassword: string;
  };
  export type Result = {
    user: UserModel;
    token: string;
  };
}
