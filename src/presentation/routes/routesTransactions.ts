import { makeGetLoginMiddleware } from "@/main/factories/middleware/getLogin";
import { adapterMiddleware } from "@/utils/adapterMiddleware";
import { Router, Request, Response } from "express";

export const routesTransactions = (router: Router) => {
  router.get(
    "/transactions/userId",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );

  router.get(
    "/transactions/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );
  router.post(
    "/transactions/create",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );

  router.patch(
    "/transactions/edit/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );

  router.delete(
    "/transactions/delete/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );
};
