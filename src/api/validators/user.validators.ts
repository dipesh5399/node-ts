import joi from "joi";
import { validator } from "../../utils/helper";

export const loginValidator = validator({
  body: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),
});
