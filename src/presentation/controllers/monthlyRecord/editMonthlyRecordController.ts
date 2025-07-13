import { Request, Response } from "express";
import { ValidationError } from "yup";
import { IResponse, ResponseStatus, getError } from "@/utils/service";
import { Controller } from "@/presentation/protocols/controller";
import { EditCategoryUseCase } from "@/data/usecases/category/editCategoryUseCase";
import { EditMonthlyRecordUseCase } from "@/data/usecases/monthlyRecord/editMonthlyRecordUseCase";

export class EditMonthlyRecordController implements Controller {
  constructor(
    private readonly editeMonthlyRecordService: EditMonthlyRecordUseCase
  ) {
    this.editeMonthlyRecordService = editeMonthlyRecordService;
  }

  async handle(
    req: Request,
    res: Response<IResponse>
  ): Promise<Response<IResponse>> {
    try {
      const { id } = req.params;
      const { title, description, goal, initial_balance, categoryId } =
        req.body;

      const data = {
        title,
        description,
        goal,
        initial_balance,
        categoryId,
      };

      const result = await this.editeMonthlyRecordService.handle({
        ...data,
        monthlyRecordId: id,
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
