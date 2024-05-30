import * as fs from "node:fs/promises";
import path from "node:path";
import User from "../models/user.js";
import Jimp from "jimp";

export const getAvatar = async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
  
      if (user === null) {
        return res.status(404).json({ message: "Not found" });
      }
      if (user.avatarURL === null) {
        return res.status(404).json({ message: "Not found" });
      }
      res.sendFile(path.resolve("public/avatars", user.avatarURL));
    } catch (error) {
      next(error);
    }
  };

export const uploudAvatar = async (req, res, next) => {
  if (!req.file) {
    return res.status(400).send({message: "Please select the avatar file"});
  }
  try {
    const avatarPath = path.resolve("public/avatars", req.file.filename);
    await fs.rename(req.file.path, path.resolve(avatarPath));

    const avatar = await Jimp.read(avatarPath);
    await avatar.resize(250, 250).writeAsync(avatarPath);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        avatarURL: `/avatars/${req.file.filename}`,
      },
      { new: true }
    );

    if (user === null) {
       return res.status(404).json({message: "Not found"});
    }
    res.status(200).json({avatarURL: user.avatarURL});
  } catch (error) {
    next(error);
  }
};


