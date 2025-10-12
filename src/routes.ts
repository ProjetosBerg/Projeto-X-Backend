import { Request, Response, Router } from "express";
import { routesUser } from "./presentation/routes/routesUser";
import { routesRecordTypes } from "./presentation/routes/routesRecordTypes";
import { routesCategory } from "./presentation/routes/routesCategory";
import { routesMonthlyRecord } from "./presentation/routes/routesMonthlyRecord";
import { routesTransactions } from "./presentation/routes/routesTransactions";
import { routesCustomFields } from "./presentation/routes/routesCustomFields";
import { adapterMiddleware } from "./utils/adapterMiddleware";
import { GetUserLogin } from "./presentation/middlewares/getUserLogin";

const router = Router();

router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ message: "ok" });
});

router.get("/auth/validate", adapterMiddleware(new GetUserLogin()), ((
  req: Request,
  res: Response
) => {
  res.status(200).json({ message: "Token válido", user: req.user });
}) as import("express").RequestHandler);

routesUser(router);
routesRecordTypes(router);
routesCategory(router);
routesMonthlyRecord(router);
routesTransactions(router);
routesCustomFields(router);
export default router;
