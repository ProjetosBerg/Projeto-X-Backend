import { makeCreateCategoryControllerFactory } from "@/main/factories/controllers/category/createRecordTypesControllerFactory";
import { makeGetLoginMiddleware } from "@/main/factories/middleware/getLogin";
import { adapterMiddleware } from "@/utils/adapterMiddleware";
import { Router, Request, Response } from "express";

export const routesCategory = (router: Router) => {
  router.post(
    "/category/create",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeCreateCategoryControllerFactory().handle(req, res);
    }
  );
};
