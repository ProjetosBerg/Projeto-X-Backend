import { Router, Request, Response } from "express";
import { makeEditUserByIdControllerFactory } from "@/main/factories/controllers/user/editUserControllerFactory";
import { makeFindQuestionsUserControllerFactory } from "@/main/factories/controllers/user/findQuestionsUserControllerFactory";
import { makeFindUserByIdControllerFactory } from "@/main/factories/controllers/user/findUserControllerFactory";
import { makeForgotPasswordUserControllerFactory } from "@/main/factories/controllers/user/forgotPasswordUserControllerFactory";
import { makeLoginUserControllerFactory } from "@/main/factories/controllers/user/loginUserControllerFactory";
import { makeRegisterUserControllerFactory } from "@/main/factories/controllers/user/registerUserControllerFactory";
import { makeGetLoginMiddleware } from "@/main/factories/middleware/getLogin";
import { adapterMiddleware } from "@/utils/adapterMiddleware";
import { makeDeleteUserByIdControllerFactory } from "@/main/factories/controllers/user/deleteUserControllerFactory";

export const routesUser = (router: Router) => {
  router.get("/user/find-questions", (req: Request, res: Response) => {
    makeFindQuestionsUserControllerFactory().handle(req, res);
  });

  router.get(
    "/user/find-user/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeFindUserByIdControllerFactory().handle(req, res);
    }
  );

  router.post("/user/register", (req: Request, res: Response) => {
    makeRegisterUserControllerFactory().handle(req, res);
  });

  router.post("/user/login", (req: Request, res: Response) => {
    makeLoginUserControllerFactory().handle(req, res);
  });

  router.patch("/user/forgot-password", (req: Request, res: Response) => {
    makeForgotPasswordUserControllerFactory().handle(req, res);
  });

  router.patch(
    "/user/edit/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeEditUserByIdControllerFactory().handle(req, res);
    }
  );

  router.delete(
    "/user/delete/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeDeleteUserByIdControllerFactory().handle(req, res);
    }
  );
};
