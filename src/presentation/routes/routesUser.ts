import { makeRegisterUserControllerFactory } from "@/main/factories/controllers/registerUserControllerFactory";
import { Router } from "express";

export const routesUser = (router: Router) => {
  router.post("/user/register", (req, res) => {
    makeRegisterUserControllerFactory().handle(req, res);
  });

  router.post("/user/login", (req, res) => {
    res.status(200).json({ message: "Login realizado com sucesso" });
  });
};
