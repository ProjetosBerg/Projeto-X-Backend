import { Request, Response, Router } from "express";
import { routesUser } from "./presentation/routes/routesUser";
import { routesRecordTypes } from "./presentation/routes/routesRecordTypes";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "ok" });
});

routesUser(router);
routesRecordTypes(router);
export default router;
