import Joi from "joi";
import { emailRegexp } from "../models/User.js";

export const userSignupSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
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

export const updateUserWaterRateSchema = Joi.object({
  waterRate: Joi.number().max(15000).required().messages({
    "any.required": `missing field "waterRate"`,
  }),
});
