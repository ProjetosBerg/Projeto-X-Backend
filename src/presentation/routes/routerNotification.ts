import { makeDeleteNotificationControllerFactory } from "@/main/factories/controllers/notification/deleteNotificationControllerFactory";
import { makeGetByIdNotificationControllerFactory } from "@/main/factories/controllers/notification/getByIdNotificationControllerFactory";
import { makeGetByUserIdNotificationControllerFactory } from "@/main/factories/controllers/notification/getByUserIdNotificationControllerFactory";
import { makeMarkReadNotificationControllerFactory } from "@/main/factories/controllers/notification/markReadNotificationControllerFactory";
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
    (req: Request, res: Response) => {
      makeGetByIdNotificationControllerFactory().handle(req, res);
    }
  );

  router.delete(
    "/notification/delete",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeDeleteNotificationControllerFactory().handle(req, res);
    }
  );
  router.patch(
    "/notification/mark-read",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeMarkReadNotificationControllerFactory().handle(req, res);
    }
  );
};
