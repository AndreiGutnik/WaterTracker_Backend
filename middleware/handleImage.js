import Jimp from "jimp";
import { HttpError } from "../helpers/index.js";

const handleImage = async (req, res, next) => {
  if (!req.file) {
    return next(HttpError(404, `File not found`));
  }
  const { path: oldPath } = req.file;
  let img = await Jimp.read(oldPath);
  img.resize(250, 250).write(oldPath);
  next();
};

export default handleImage;
