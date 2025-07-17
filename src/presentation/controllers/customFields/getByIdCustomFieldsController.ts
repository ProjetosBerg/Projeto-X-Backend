// import { Request, Response } from "express";
// import { ValidationError } from "yup";
// import { IResponse, ResponseStatus, getError } from "@/utils/service";
// import { Controller } from "@/presentation/protocols/controller";
// import { GetByIdTransactionUseCase } from "@/data/usecases/transactions/getByIdTransactionUseCase";

// export class GetByIdCustomFieldsController implements Controller {
//   constructor(
//     private readonly getByIdCustomFieldsService: GetByIdCustomFieldsUseCase
//   ) {
//     this.getByIdCustomFieldsService = getByIdCustomFieldsService;
//   }

//   async handle(
//     req: Request,
//     res: Response<IResponse>
//   ): Promise<Response<IResponse>> {
//     try {
//       const { id } = req.params;
//       const result = await this.getByIdCustomFieldsService.handle({
//         transactionId: String(id),
//         userId: req.user!.id,
//       });
//       return res.status(200).json({
//         status: ResponseStatus.OK,
//         data: result,
//         message: "Registro obtido com sucesso",
//       });
//     } catch (error) {
//       if (error instanceof ValidationError) {
//         return res.status(400).json({
//           status: ResponseStatus.BAD_REQUEST,
//           errors: error.errors,
//         });
//       }
//       return res.status(500).json({
//         status: ResponseStatus.INTERNAL_SERVER_ERROR,
//         message: getError(error),
//       });
//     }
//   }
// }
