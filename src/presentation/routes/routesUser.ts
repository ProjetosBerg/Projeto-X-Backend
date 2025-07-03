import { makeRegisterUserUseControllerFactory } from "@/main/factories/controllers/registerUserControllerFactory";
import { Router } from "express";

export const routesUser = (router: Router) => {
  router.post("/user/register", (req, res) => {
    makeRegisterUserUseControllerFactory().handle(req, res);
  });
};
