import Joi from "joi";

export const waterAddSchema = Joi.object({
  date: Joi.date(),
  amountWater: Joi.number().min(0).max(5000),
});

export const waterUpdateSchema = Joi.object({
  date: Joi.date(),
  amountWater: Joi.number().min(0).max(5000),
});
