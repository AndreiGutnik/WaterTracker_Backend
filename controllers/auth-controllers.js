import User from "../models/User.js";
import { HttpError, cloudinary } from "../helpers/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
// import gravatar from "gravatar";
// import { nanoid } from "nanoid";

import "dotenv/config";

import { ctrlWrapper } from "../decorators/index.js";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email is use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  // const verificationToken = nanoid();
  // const avatarURL = gravatar.url(email);
  const newUser = await User.create({
    ...req.body,
    // avatarURL,
    password: hashPassword,
    // verificationToken,
  });
  // const verifyEmail = {
  //   to: email,
  //   subject: "Verify email",
  //   html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  // };

  // await sendEmail(verifyEmail);
  res.status(201).json({
    user: {
      email: newUser.email,
    },
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  // if (!user.verify) {
  //   throw HttpError(401, "Email is not verify");
  // }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    user: {
      name: user.name,
      email: user.email,
      gender: user.gender,
      waterRate: user.waterRate,
      avatarURL: user.avatarURL,
    },
    token,
  });
};

const getCurrent = async (req, res) => {
  const { _id, email, name, gender, waterRate, avatarURL, createdAt, updatedAt } = req.user;
  res.json({
    _id,
    name,
    email,
    gender,
    waterRate,
    avatarURL,
    createdAt,
    updatedAt,
  });
};

const signout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).send();
};

const updateUser = async (req, res) => {
  const { _id } = req.user;
  const { password, newPassword } = req.body;
  let user = await User.findById(_id);
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!password && newPassword) {
    throw HttpError(401, "Password is wrong");
  } else if (password && newPassword) {
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Password is wrong");
    }
    const hashPassword = await bcrypt.hash(newPassword, 10);
    const newBody = req.body;
    delete newBody.newPassword;
    const result = await User.findOneAndUpdate(_id, { ...newBody, password: hashPassword });
    user = await User.findById(_id, "-password -token");
  }

  if (!password && !newPassword) {
    const newBody = req.body;
    delete newBody.password;
    delete newBody.newPassword;
    const result = await User.findOneAndUpdate(_id, newBody);
    if (!result) {
      throw HttpError(404, `Not found`);
    }
    user = await User.findById(_id, "-password -token");
  }

  res.json(user);
};

const waterRate = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findOneAndUpdate(_id, req.body);
  if (!user) {
    throw HttpError(404, `Not found`);
  }

  res.json({
    waterRate: user.waterRate,
  });
};

const updateavatar = async (req, res) => {
  const { _id } = req.user;

  const { url: avatarURL } = await cloudinary.uploader.upload(req.file.path, {
    folder: "WaterTracker/avatars",
  });
  await fs.unlink(req.file.path);
  const user = await User.findByIdAndUpdate(_id, { avatarURL });
  if (!user) {
    throw HttpError(404, `Not found`);
  }

  res.json({
    avatarURL,
  });
};

// const verificationEmail = async (req, res) => {
//   const { verificationToken } = req.params;
//   const user = await User.findOne({ verificationToken });
//   if (!user) {
//     throw HttpError(404, "User not found");
//   }
//   await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
//   res.status(200).json({
//     message: "Verification successful",
//   });
// };

// const resendVerify = async (req, res) => {
//   const { email } = req.body;
//   const user = await User.findOne({ email });
//   if (!user) {
//     throw HttpError(401, "Email not found");
//   }
//   if (user.verify) {
//     throw HttpError(400, "Verification has already been passed");
//   }
//   const verifyEmail = {
//     to: email,
//     subject: "Verify email",
//     html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
//   };

//   await sendEmail(verifyEmail);

//   res.json({
//     message: "Verification email sent",
//   });
// };

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  signout: ctrlWrapper(signout),
  updateavatar: ctrlWrapper(updateavatar),
  updateUser: ctrlWrapper(updateUser),
  waterRate: ctrlWrapper(waterRate),
  // verificationEmail: ctrlWrapper(verificationEmail),
  // resendVerify: ctrlWrapper(resendVerify),
};
