// import { Request, Response } from "express";
// import { ValidationError } from "yup";
// import { IResponse, ResponseStatus, getError } from "@/utils/service";
// import { Controller } from "@/presentation/protocols/controller";
// import { GetByUserIdMonthlyRecordUseCase } from "@/data/usecases/monthlyRecord/getByUserIdMonthlyRecordUseCase";

// export class GetByUserIdTransactionController implements Controller {
//   constructor(
//     private readonly getByUserIdTransactionService: GetByUserIdTransactionUseCase
//   ) {
//     this.getByUserIdTransactionService = getByUserIdTransactionService;
//   }

//   async handle(
//     req: Request,
//     res: Response<IResponse>
//   ): Promise<Response<IResponse>> {
//     try {
//       const { categoryId } = req.body;
//       const result = await this.getByUserIdTransactionService.handle({
//         categoryId,
//         userId: req.user!.id,
//       });
//       return res.status(200).json({
//         status: ResponseStatus.OK,
//         data: result,
//         message: "Registros obtidos com sucesso",
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
