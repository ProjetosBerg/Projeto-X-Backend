import { CustomFieldModel } from "@/domain/models/mongo/CustomFieldModel";

export interface GetByUserIdCustomFieldUseCaseProtocol {
  handle(
    data: GetByUserIdCustomFieldUseCaseProtocol.Params
  ): Promise<CustomFieldModel[]>;
}

export namespace GetByUserIdCustomFieldUseCaseProtocol {
  export type Params = {
    userId: CustomFieldModel["user_id"];
  };
}
