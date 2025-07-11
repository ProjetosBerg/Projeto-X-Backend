// import { Request, Response } from "express";
// import { ValidationError } from "yup";
// import { IResponse, ResponseStatus, getError } from "@/utils/service";
// import { Controller } from "@/presentation/protocols/controller";
// import { CreateCategoryUseCase } from "@/data/usecases/category/createCategoryUseCase";

// export class CreateMonthlyRecordController implements Controller {
//   constructor(
//     private readonly createMonthlyRecordService: CreateMonthlyRecordUseCase
//   ) {
//     this.createMonthlyRecordService = createMonthlyRecordService;
//   }

//   async handle(
//     req: Request,
//     res: Response<IResponse>
//   ): Promise<Response<IResponse>> {
//     try {
//       const { name, description, type, recordTypeId } = req.body;

//       const data = {
//         name,
//         description,
//         type,
//         recordTypeId,
//       };

//       const createMonthlyRecord = await this.createMonthlyRecordService.handle({
//         ...data,
//         userId: req.user!.id,
//       });
//       return res.status(201).json({
//         status: ResponseStatus.OK,
//         data: createMonthlyRecord,
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
