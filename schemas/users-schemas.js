import Joi from "joi";
import { emailRegexp } from "../models/User.js";

export const userSignupSchema = Joi.object({
  name: Joi.string().min(3).max(32).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  gender: Joi.string().valid("mail", "female"),
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

export const updateUserSubscriptionSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business").required(),
});

export const userAvatarSchema = Joi.object({
  avatar: Joi.string().required().messages({
    "any.required": `missing field "avatar"`,
  }),
});
