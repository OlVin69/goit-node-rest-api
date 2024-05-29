import express from "express";

import {uploudAvatar, getAvatar} from "../controllers/avatarControllers.js";

import { uploadMiddleware } from "../middlewares/upload.js";

const avatarRouter = express.Router();

avatarRouter.get("/", getAvatar);

avatarRouter.patch("/", uploadMiddleware.single("avatar"), uploudAvatar);

export default avatarRouter;