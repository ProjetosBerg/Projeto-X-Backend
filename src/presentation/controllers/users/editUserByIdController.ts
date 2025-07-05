import { Request, Response } from "express";
import { ValidationError } from "yup";
import { IResponse, ResponseStatus, getError } from "@/utils/service";
import { Controller } from "@/presentation/protocols/controller";
import { EditUserByIdUseCase } from "@/data/usecases/users/editUserByIdUseCase";

export class EditUserByIdController implements Controller {
  constructor(private readonly editUserByIdService: EditUserByIdUseCase) {
    this.editUserByIdService = editUserByIdService;
  }

  async handle(
    req: Request,
    res: Response<IResponse>
  ): Promise<Response<IResponse>> {
    try {
      const { id } = req.params;
      const { name, email, securityQuestions } = req.body;

      const data = {
        name,
        email,
        securityQuestions,
      };
      const result = await this.editUserByIdService.handle({ ...data, id });
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
