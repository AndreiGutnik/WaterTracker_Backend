import express from "express";

import waterController from "../../controllers/water-controllers.js";
import {
  authenticate,
  isEmptyBody,
  isValidId,
} from "../../middleware/index.js";
import { validateBody } from "../../decorators/index.js";
import {
  waterAddSchema,
  waterUpdateSchema,
} from "../../schemas/water-schemas.js";

const waterRouter = express.Router();

waterRouter.use(authenticate);

waterRouter.get("/", waterController.getAllWater);

waterRouter.get("/today", waterController.getWaterByDate);
waterRouter.get("/month", waterController.getWaterByMonth);

waterRouter.get("/:id", isValidId, waterController.getWaterById);

waterRouter.post(
  "/",
  isEmptyBody,
  validateBody(waterAddSchema),
  waterController.addWater
);

waterRouter.delete("/:id", isValidId, waterController.deleteWaterById);

waterRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(waterUpdateSchema),
  waterController.updateWaterById
);

export default waterRouter;
