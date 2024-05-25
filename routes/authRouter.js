import express from "express";
import authController from "../controllers/authControllers.js";
import tokenCheck from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/logout", tokenCheck, authController.logout);
authRouter.get("/current", tokenCheck, authController.getCurrent);
authRouter.patch("/", tokenCheck, authController.updateSubscription)
export default authRouter;

