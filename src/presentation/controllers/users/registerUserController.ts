import { Request, Response } from "express";
import { ValidationError } from "yup";
import { IResponse, ResponseStatus, getError } from "@/utils/service";
import { Controller } from "@/presentation/protocols/controller";
import { RegisterUserUseCase } from "@/data/usecases/users/registerUserUseCase";

export class RegisterUserController implements Controller {
  constructor(private readonly createUserService: RegisterUserUseCase) {
    this.createUserService = createUserService;
  }

  async handle(
    req: Request,
    res: Response<IResponse>
  ): Promise<Response<IResponse>> {
    try {
      const {
        name,
        login,
        email,
        password,
        confirmpassword,
        securityQuestions,
      } = req.body;
      const data = {
        name,
        login,
        email,
        password,
        confirmpassword,
        securityQuestions,
      };
      const createUser = await this.createUserService.handle({ ...data });
      return res.status(201).json({
        status: ResponseStatus.OK,
        data: createUser,
        message: "Usuário criado com sucesso",
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
