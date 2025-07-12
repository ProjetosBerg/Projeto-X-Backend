import { makeCreateMonthlyRecordControllerFactory } from "@/main/factories/controllers/monthlyRecord/createMonthlyRecordControllerFactory";
import { makeGetLoginMiddleware } from "@/main/factories/middleware/getLogin";
import { adapterMiddleware } from "@/utils/adapterMiddleware";
import { Router, Request, Response } from "express";

export const routesMonthlyRecord = (router: Router) => {
  router.get(
    "/monthly-record/userId",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );

  router.get(
    "/monthly-record/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );
  router.post(
    "/monthly-record/create",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeCreateMonthlyRecordControllerFactory().handle(req, res);
    }
  );

  router.patch(
    "/monthly-record/edit/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );

  router.delete(
    "/monthly-record/delete/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );
};
