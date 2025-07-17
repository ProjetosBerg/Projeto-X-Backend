// import { Request, Response } from "express";
// import { ValidationError } from "yup";
// import { IResponse, ResponseStatus, getError } from "@/utils/service";
// import { Controller } from "@/presentation/protocols/controller";
// import { CreateTransactionUseCase } from "@/data/usecases/transactions/createTransactionUseCase";

// export class CreateCustomFieldsController implements Controller {
//   constructor(
//     private readonly createCustomFieldsService: CreateCustomFieldsUseCase
//   ) {
//     this.createCustomFieldsService = createCustomFieldsService;
//   }

//   async handle(
//     req: Request,
//     res: Response<IResponse>
//   ): Promise<Response<IResponse>> {
//     try {
//       const {
//         title,
//         description,
//         amount,
//         transactionDate,
//         monthlyRecordId,
//         categoryId,
//       } = req.body;

//       const data = {
//         title,
//         description,
//         amount,
//         transactionDate,
//         monthlyRecordId,
//         categoryId,
//       };

//       const createTransaction = await this.createCustomFieldsService.handle({
//         ...data,
//         userId: req.user!.id,
//       });
//       return res.status(201).json({
//         status: ResponseStatus.OK,
//         data: createTransaction,
//         message: "Registro ao relatorio mensal criado com sucesso",
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
