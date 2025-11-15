import { makeDeleteNotificationControllerFactory } from "@/main/factories/controllers/notification/deleteNotificationControllerFactory";
import { makeGetByUserIdNotificationControllerFactory } from "@/main/factories/controllers/notification/getByUserIdNotificationControllerFactory";
import { makeGetLoginMiddleware } from "@/main/factories/middleware/getLogin";
import { adapterMiddleware } from "@/utils/adapterMiddleware";
import { Router, Request, Response } from "express";

export const routesNotification = (router: Router) => {
  router.get(
    "/notification/userId",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeGetByUserIdNotificationControllerFactory().handle(req, res);
    }
  );

  router.get(
    "/notification/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {}
  );

  router.delete(
    "/notification/delete",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeDeleteNotificationControllerFactory().handle(req, res);
    }
  );
};
