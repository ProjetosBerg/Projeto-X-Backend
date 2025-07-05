import { SecurityQuestionModel } from "@/domain/models/postgres/SecurityQuestionModel";
import { UserModel } from "@/domain/models/postgres/UserModel";

export interface FindUserByIdUseCaseProtocol {
  handle(
    data: FindUserByIdUseCaseProtocol.Params
  ): Promise<FindUserByIdUseCaseProtocol.Result>;
}

export namespace FindUserByIdUseCaseProtocol {
  export type Params = {
    id: UserModel["id"];
  };
  export type Result = {
    user: UserModel;
  };
}
