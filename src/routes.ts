import { Request, Response, Router } from "express";
import { routesUser } from "./presentation/routes/routesUser";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "ok" });
});

routesUser(router);

export default router;
