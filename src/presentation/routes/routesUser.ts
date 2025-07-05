import { Router, Request, Response } from "express";
import { makeEditUserByIdControllerFactory } from "@/main/factories/controllers/editUserControllerFactory";
import { makeFindQuestionsUserControllerFactory } from "@/main/factories/controllers/findQuestionsUserControllerFactory";
import { makeFindUserByIdControllerFactory } from "@/main/factories/controllers/findUserControllerFactory";
import { makeForgotPasswordUserControllerFactory } from "@/main/factories/controllers/forgotPasswordUserControllerFactory";
import { makeLoginUserControllerFactory } from "@/main/factories/controllers/loginUserControllerFactory";
import { makeRegisterUserControllerFactory } from "@/main/factories/controllers/registerUserControllerFactory";
import { makeGetLoginMiddleware } from "@/main/factories/middleware/getLogin";
import { adapterMiddleware } from "@/utils/adapterMiddleware";

export const routesUser = (router: Router) => {
  router.get("/user/find-questions", (req: Request, res: Response) => {
    makeFindQuestionsUserControllerFactory().handle(req, res);
  });

  router.post("/user/register", (req: Request, res: Response) => {
    makeRegisterUserControllerFactory().handle(req, res);
  });

  router.post("/user/login", (req: Request, res: Response) => {
    makeLoginUserControllerFactory().handle(req, res);
  });

  router.patch("/user/forgot-password", (req: Request, res: Response) => {
    makeForgotPasswordUserControllerFactory().handle(req, res);
  });

  router.get(
    "/user/find-user/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeFindUserByIdControllerFactory().handle(req, res);
    }
  );

  router.patch(
    "/user/edit/:id",
    adapterMiddleware(makeGetLoginMiddleware()),
    (req: Request, res: Response) => {
      makeEditUserByIdControllerFactory().handle(req, res);
    }
  );
};
