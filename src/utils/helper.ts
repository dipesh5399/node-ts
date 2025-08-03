import { validate } from "express-validation";
import { IResponseObject, validationSchema } from "../index.types";

export const successObj = ({ message = "", result = {} }: IResponseObject) => {
  return {
    success: true,
    message,
    result,
  };
};

export const errorObj = ({ message = "", error = {} }: IResponseObject) => {
  return {
    success: false,
    message,
    error,
  };
};

export const validator = (schema: validationSchema) =>
  validate(
    schema,
    { keyByField: true, context: true, statusCode: 403 },
    { abortEarly: false, cache: true }
  );
