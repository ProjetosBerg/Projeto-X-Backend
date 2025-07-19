import { Request, Response } from "express";
import { ValidationError } from "yup";
import { IResponse, ResponseStatus, getError } from "@/utils/service";
import { Controller } from "@/presentation/protocols/controller";
import { GetByUserIdCustomFieldUseCase } from "@/data/usecases/customFields/getByUserIdTransactionUseCase";

export class GetByUserIdCustomFieldsController implements Controller {
  constructor(
    private readonly getByUserIdCustomFieldsService: GetByUserIdCustomFieldUseCase
  ) {
    this.getByUserIdCustomFieldsService = getByUserIdCustomFieldsService;
  }

  async handle(
    req: Request,
    res: Response<IResponse>
  ): Promise<Response<IResponse>> {
    try {
      const result = await this.getByUserIdCustomFieldsService.handle({
        userId: req.user!.id,
      });
      return res.status(200).json({
        status: ResponseStatus.OK,
        data: result,
        message: "Campos customizados obtidos com sucesso",
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          status: ResponseStatus.BAD_REQUEST,
          errors: error.errors,
        });
      }
      return res.status(500).json({
        status: ResponseStatus.INTERNAL_SERVER_ERROR,
        message: getError(error),
      });
    }
  }
}
