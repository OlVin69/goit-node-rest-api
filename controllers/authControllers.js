import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

import {
  createUserSchema,
  updateSubscriptionSchema,
} from "../schemas/userSchema.js";

import gravatar from "gravatar";

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

    const avatarURL = gravatar.url(
      email,
      { s: "200", r: "x", d: "retro" },
      false
    );

    await User.create({
      email: emailInLowerCase,
      password: passwordHash,
      avatarURL,
    });

    res.status(201).json({
      user: {
        email,
        subscription: "starter",
        avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
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
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, subscription: user.subscription },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );

    await User.findByIdAndUpdate(user._id, {
      token,
    });
    console.log(token);
    res.send({ token, user: { email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);

    if (user === null) {
      res.status(404).json({ message: "Not found" });
    }
    res
      .status(200)
      .json({ email: user.email, subscription: user.subscription });
  } catch (error) {
    next(error);
  }
};

const updateSubscription = async (req, res, next) => {
  const { id } = req.user;
  const { subscription } = req.body;
  try {
    const { error } = updateSubscriptionSchema.validate({ subscription });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = await User.findById(id);

    if (contact === null) {
      return res.status(404).json({ message: "Not found" });
    }

    const result = await User.findByIdAndUpdate(id, req.body);

    if (result === null) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export default { register, login, logout, getCurrent, updateSubscription };
