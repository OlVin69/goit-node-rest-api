import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import {
  createUserSchema,
  updateSubscriptionSchema,
  emailSchema,
} from "../schemas/userSchema.js";
import gravatar from "gravatar";
import { sendMail } from "../mail/mail.js";
import { v4 as uuidv4 } from "uuid";

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const verificationToken = uuidv4();

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
      true
    );

    await User.create({
      email: emailInLowerCase,
      password: passwordHash,
      avatarURL,
      verificationToken,
    });

    sendMail(email, verificationToken);

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

    if (user.verify === false) {
      return res.status(401).send({ message: "Please, verify your email" });
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

export const updateVerification = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ verificationToken });
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.status(200).send({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const repeatVerification = async (req, res, next) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).send({ message: "missing required field email" });
  }

  try {
    const { error } = emailSchema.validate({ email });
    if (error) {
      return res.status(400).send({ message: error.message });
    }
    const emailInLowerCase = email.toLowerCase();
    const user = await User.findOne({ email: emailInLowerCase });
    if (user === null) {
      return res.status(400).send({ message: "Not found" });
    }
    const verificationToken = user.verificationToken;

    if (user.verify) {
      return res
        .status(400)
        .send({ message: "Verification has already been passed" });
    }

    sendMail(email, verificationToken);

    res.status(200).send({ message: email });
  } catch (error) {
    next(error);
  }
};

export default { register, login, logout, getCurrent, updateSubscription, updateVerification, repeatVerification };
