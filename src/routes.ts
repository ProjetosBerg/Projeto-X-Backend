import { Request, Response, Router } from "express";
import { routesUser } from "./presentation/routes/routesUser";
import { routesRecordTypes } from "./presentation/routes/routesRecordTypes";
import { routesCategory } from "./presentation/routes/routesCategory";
import { routesMonthlyRecord } from "./presentation/routes/routesMonthlyRecord";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "ok" });
});

routesUser(router);
routesRecordTypes(router);
routesCategory(router);
routesMonthlyRecord(router);
export default router;
