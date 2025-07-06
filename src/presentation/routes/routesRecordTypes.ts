import { makeCreateRecordTypesControllerFactory } from "@/main/factories/controllers/recordTypes/createRecordTypesControllerFactory";
import { makeGetByUserIdRecordTypesControllerFactory } from "@/main/factories/controllers/recordTypes/getByUserIdRecordTypesControllerFactory";
import { makeGetLoginMiddleware } from "@/main/factories/middleware/getLogin";
import { adapterMiddleware } from "@/utils/adapterMiddleware";
import { Router, Request, Response } from "express";

export const routesRecordTypes = (router: Router) => {
  router.get(
    "/record-types/userId",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeGetByUserIdRecordTypesControllerFactory().handle(req, res);
    }
  );
  router.post(
    "/record-types/create",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeCreateRecordTypesControllerFactory().handle(req, res);
    }
  );
};
