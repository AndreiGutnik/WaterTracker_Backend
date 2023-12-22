import express from "express";

import authController from "../../controllers/auth-controllers.js";
import { authenticate, isEmptyBody, upload, handleImage } from "../../middleware/index.js";
import { validateBody } from "../../decorators/index.js";
import {
  userSignupSchema,
  userSigninSchema,
  updateUserSubscriptionSchema,
  // userEmailSchema,
} from "../../schemas/users-schemas.js";

const authRouter = express.Router();

//upload.array("avatar", 6);
//upload.fields([{name:"avatar", maxCount: 1}])
authRouter.post(
  "/register",
  upload.single("avatar"),
  isEmptyBody,
  validateBody(userSignupSchema),
  authController.signup
);

authRouter.post("/login", isEmptyBody, validateBody(userSigninSchema), authController.signin);

// authRouter.get("/verify/:verificationToken", authController.verificationEmail);

// authRouter.post("/verify", isEmptyBody, validateBody(userEmailSchema), authController.resendVerify);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.signout);

authRouter.patch(
  "/",
  authenticate,
  validateBody(updateUserSubscriptionSchema),
  authController.updateSubscription
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  handleImage,
  authController.updateavatar
);

export default authRouter;
