import express from "express";
import * as fundingController from "../controller/funding.js";
import isAuth from "../middleware/auth.js";
import { uploader } from "../middleware/uploader.js";

const router = express.Router();

router.get("/", fundingController.getFundings);
router.get("/:itemId", fundingController.getFunding);
router.post(
  "/",
  isAuth,
  uploader.fields([{ name: "thumbnail", maxCount: 1 }, { name: "images" }]),
  fundingController.postFunding
);
router.put(
  "/:itemId",
  isAuth,
  uploader.fields([{ name: "thumbnail", maxCount: 1 }, { name: "images" }]),
  fundingController.updateFunding
);
router.delete("/:itemId", isAuth, fundingController.deleteFunding);
router.put("/:itemId/funding", isAuth, fundingController.priceUpdateFunding);
router.get("/ranking/5", fundingController.getRankingFundings);

export default router;
