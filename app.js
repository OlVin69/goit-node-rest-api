import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import avatarRouter from "./routes/usersRouter.js";
import tokenCheck from "./middlewares/auth.js";
import "./db.js";

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", tokenCheck, contactsRouter);
app.use("/api/users", authRouter);
app.use("/api/users/avatars", tokenCheck, avatarRouter); 
app.use("/avatars", express.static(path.resolve("public/avatars")));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
