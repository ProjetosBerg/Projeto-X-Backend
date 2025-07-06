import { Request, Response } from "express";
import { ValidationError } from "yup";
import { IResponse, ResponseStatus, getError } from "@/utils/service";
import { Controller } from "@/presentation/protocols/controller";
import { CreateRecordTypeUseCase } from "@/data/usecases/recordTypes/createRecordTypesUseCase";
import { checkUserAuthorization } from "@/presentation/validation/ValidateUser";
import { GetByUserIdRecordTypeUseCase } from "@/data/usecases/recordTypes/getByUserIdRecordTypesUseCase";

export class GetByUserIdRecordTypesController implements Controller {
  constructor(
    private readonly getByUserIdRecordTypesService: GetByUserIdRecordTypeUseCase
  ) {
    this.getByUserIdRecordTypesService = getByUserIdRecordTypesService;
  }

  async handle(
    req: Request,
    res: Response<IResponse>
  ): Promise<Response<IResponse>> {
    try {
      const result = await this.getByUserIdRecordTypesService.handle({
        userId: req.user!.id,
      });
      return res.status(200).json({
        status: ResponseStatus.OK,
        data: result,
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
