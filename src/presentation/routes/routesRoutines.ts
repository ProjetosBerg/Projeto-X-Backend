import { makeGetLoginMiddleware } from "@/main/factories/middleware/getLogin";
import { adapterMiddleware } from "@/utils/adapterMiddleware";
import { Router, Request, Response } from "express";
import { makeCreateRoutinesControllerFactory } from "@/main/factories/controllers/routines/createRoutinesControllerFactory";
import { makeGetByUserIdRoutinesControllerFactory } from "@/main/factories/controllers/routines/getByUserIdRoutinesControllerFactory";

export const routesRoutines = (router: Router) => {
  router.get(
    "/routines/userId",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeGetByUserIdRoutinesControllerFactory().handle(req, res);
    }
  );

  router.get(
    "/routines/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );
  router.post(
    "/routines/create",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeCreateRoutinesControllerFactory().handle(req, res);
    }
  );

  router.patch(
    "/routines/edit/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );

  router.delete(
    "/routines/delete/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );
};
