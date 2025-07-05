import { Request, Response } from "express";
import { ValidationError } from "yup";
import { IResponse, ResponseStatus, getError } from "@/utils/service";
import { Controller } from "@/presentation/protocols/controller";
import { FindUserByIdUseCase } from "@/data/usecases/users/findUserByIdUseCase";
import { DeleteUserByIdUseCase } from "@/data/usecases/users/deleteUserByIdUseCase";

export class DeleteUserByIdController implements Controller {
  constructor(private readonly deleteUserByIdService: DeleteUserByIdUseCase) {
    this.deleteUserByIdService = deleteUserByIdService;
  }

  async handle(
    req: Request,
    res: Response<IResponse>
  ): Promise<Response<IResponse>> {
    try {
      const { id } = req.params;
      const result = await this.deleteUserByIdService.handle({ id });
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
