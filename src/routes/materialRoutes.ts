import { Router } from "express";

import { materialController } from "../controllers/materialControllers";

const router = Router();

router.get("/", materialController.list);

router.post("/", materialController.create);

export default router;