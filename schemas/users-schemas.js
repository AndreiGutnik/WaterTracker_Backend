import Joi from "joi";
import { emailRegexp } from "../models/User.js";

export const userSignupSchema = Joi.object({
  name: Joi.string().min(3).max(32),
  email: Joi.string().pattern(emailRegexp).required(),
  gender: Joi.string().valid("male", "female"),
  password: Joi.string().min(6).required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

// export const userEmailSchema = Joi.object({
//   email: Joi.string().pattern(emailRegexp).required().messages({
//     "any.required": `missing required field email`,
//   }),
// });

export const userAvatarSchema = Joi.object({
  avatar: Joi.string().required().messages({
    "any.required": `missing field "avatar"`,
  }),
});
