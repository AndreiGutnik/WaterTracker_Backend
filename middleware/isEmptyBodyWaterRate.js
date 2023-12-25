import { HttpError } from "../helpers/index.js";

const isEmptyBodyWaterRate = async (req, res, next) => {
  const keys = Object.keys(req.body);
  if (keys.length !== 1 && keys[0] !== "favorite") {
    return next(HttpError(400, "Missing field waterRate."));
  }
  next();
};

export default isEmptyBodyWaterRate;
