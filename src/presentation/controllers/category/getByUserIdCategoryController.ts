import { Request, Response } from "express";
import { ValidationError } from "yup";
import { IResponse, ResponseStatus, getError } from "@/utils/service";
import { Controller } from "@/presentation/protocols/controller";
import { GetByUserIdCategoryUseCase } from "@/data/usecases/category/getByUserIdCategoryUseCase";

export class GetByUserIdCategoryController implements Controller {
  constructor(
    private readonly getByUserIdCategoryService: GetByUserIdCategoryUseCase
  ) {
    this.getByUserIdCategoryService = getByUserIdCategoryService;
  }

  async handle(
    req: Request,
    res: Response<IResponse>
  ): Promise<Response<IResponse>> {
    try {
      const result = await this.getByUserIdCategoryService.handle({
        userId: req.user!.id,
      });
      return res.status(200).json({
        status: ResponseStatus.OK,
        data: result,
        message: "Categorias obtidas com sucesso",
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
