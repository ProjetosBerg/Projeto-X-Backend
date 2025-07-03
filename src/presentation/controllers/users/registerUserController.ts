import { Request, Response } from "express";
import { ValidationError } from "yup";
import { IResponse, ResponseStatus, getError } from "@/utils/service";
import { Controller } from "@/presentation/protocols/controller";
import { RegisterUserCase } from "@/data/usecases/users/registerUserUseCase";

export class RegisterUserController implements Controller {
  constructor(private readonly createUserService: RegisterUserCase) {
    this.createUserService = createUserService;
  }

  async handle(
    req: Request,
    res: Response<IResponse>
  ): Promise<Response<IResponse>> {
    try {
      const message = await this.createUserService.handle({});
      return res.status(201).json({
        status: ResponseStatus.OK,
        data: message,
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
