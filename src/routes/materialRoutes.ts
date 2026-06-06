import { Router } from "express";
import { materialController } from "../controllers/materialControllers";

const router = Router();

router.get("/", materialController.list);
router.get("/:id", materialController.getById);
router.post("/", materialController.create);
router.put("/:id", materialController.update);
router.delete("/:id", materialController.delete);

export default router;