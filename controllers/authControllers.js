import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

import User from "../models/user.js";

import { createUserSchema } from "../schemas/userSchema.js";

const register = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const { error } = createUserSchema.validate({
      email,
      password,
    });
    if (typeof error !== "undefined") {
      return res.status(400).json({ message: error.message });
    }

    const emailInLowerCase = email.toLowerCase();

    const user = await User.findOne({ email: emailInLowerCase });

    if (user !== null) {
      return res.status(409).json({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await User.create({
      email: emailInLowerCase,
      password: passwordHash,
      subscription,
    });

    res.status(201).json({
      user: {
        email,
        subscription: "starter",
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const emailInLowerCase = email.toLowerCase();

  try {
    const { error } = createUserSchema.validate({
      email,
      password,
    });
    if (typeof error !== "undefined") {
      return res.status(400).json({ message: error.message });
    }

    const user = await User.findOne({ email: emailInLowerCase });

    if (user === null) {
      return res
        .status(401)
        .json({ message: "Email or password is uncorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res
        .status(401)
        .json({ message: "Email or password is uncorrect" });

      const token = jwt.sign(
        { id: user._id, email: user.email, subscription: user.subscription },
        process.env.JWT_SECRET,
        { expiresIn: 60 * 60 }
      );

      await User.findByIdAndUpdate(user._id, {
        token,
      });

      res.send({ token, user: { email, subscription: user.subscription } });
    }
  } catch (error) {
    next(error);
  }
};

export default { register, login };
