import express from "express";
import authController from "../controllers/authControllers.js";
import tokenCheck from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/logout", tokenCheck, authController.logout);
authRouter.get("/current", tokenCheck, authController.getCurrent);
authRouter.patch("/", tokenCheck, authController.updateSubscription)
authRouter.get("/verify/:verificationToken", authController.updateVerification);
authRouter.post("/verify", authController.repeatVerification);
export default authRouter;

