export interface EditCustomFieldUseCaseProtocol {
  handle(data: EditCustomFieldUseCaseProtocol.Params): Promise<any>;
}

export namespace EditCustomFieldUseCaseProtocol {
  export type Params = {};
}
