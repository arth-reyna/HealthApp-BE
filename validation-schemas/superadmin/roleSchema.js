import joi from "joi";

export const roleSchema = {
  teacher: joi.object({
    name: joi.string().required(),
    email: joi.string().email().required().lowercase(),
    password: joi.string().min(6).required(),
    domain: joi.string().required(),
  }),

  student: joi.object({
    name: joi.string().required(),
    email: joi.string().email().required().lowercase(),
    password: joi.string().min(6).required(),
    gender: joi.string().valid("male", "female").required(),
  }),

  admin: joi.object({
    email: joi.string().email().required().lowercase(),
    password: joi.string().min(6).required(),
  }),
};
