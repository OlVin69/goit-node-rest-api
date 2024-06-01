import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve("tmp"));
  },
  filename: function (req, file, cb) {
    const extname = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extname);
    const suffix = crypto.randomUUID();
    cb(null, `${basename}-${suffix}${extname}`);
  },
});

export const uploadMiddleware = multer({ storage });