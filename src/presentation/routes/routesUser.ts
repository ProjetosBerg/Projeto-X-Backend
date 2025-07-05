import { makeFindQuestionsUserControllerFactory } from "@/main/factories/controllers/findQuestionsUserControllerFactory";
import { makeForgotPasswordUserControllerFactory } from "@/main/factories/controllers/forgotPasswordUserControllerFactory";
import { makeLoginUserControllerFactory } from "@/main/factories/controllers/loginUserControllerFactory";
import { makeRegisterUserControllerFactory } from "@/main/factories/controllers/registerUserControllerFactory";
import { Router } from "express";

export const routesUser = (router: Router) => {
  router.post("/user/register", (req, res) => {
    makeRegisterUserControllerFactory().handle(req, res);
  });

  router.post("/user/login", (req, res) => {
    makeLoginUserControllerFactory().handle(req, res);
  });

  router.patch("/user/forgot-password", (req, res) => {
    makeForgotPasswordUserControllerFactory().handle(req, res);
  });

  router.get("/user/find-questions", (req, res) => {
    makeFindQuestionsUserControllerFactory().handle(req, res);
  });
};
