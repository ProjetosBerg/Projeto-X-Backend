import { makeCreateCustomFieldsControllerFactory } from "@/main/factories/controllers/customFields/createCustomFieldsControllerFactory";
import { makeGetLoginMiddleware } from "@/main/factories/middleware/getLogin";
import { adapterMiddleware } from "@/utils/adapterMiddleware";
import { Router, Request, Response } from "express";

export const routesCustomFields = (router: Router) => {
  router.get(
    "/custom-fields/userId",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );

  router.get(
    "/custom-fields/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );
  router.post(
    "/custom-fields/create",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeCreateCustomFieldsControllerFactory().handle(req, res);
    }
  );

  router.patch(
    "/custom-fields/edit/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );

  router.delete(
    "/custom-fields/delete/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );
};
