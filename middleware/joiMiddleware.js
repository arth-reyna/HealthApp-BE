import { badRequest } from "../utils/responseHandler.js";
import { roleSchema } from "../validation-schemas/superadmin/roleSchema.js";

export const validateByRole = (req, res, next) => {
  //fetch the role
  const { role } = req.params;
  console.log("Joi Middleware Role: ", role);

  //check validator schema
  const schema = roleSchema[role];

  if (!schema) throw new AppError(400, "Token not present");

  const { value, error } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: false,
  });

  console.log("Value: ", value, "Error: ", error);

  if (error) throw new AppError(400, "Error validation schema");

  req.body = value;
  next();
};
