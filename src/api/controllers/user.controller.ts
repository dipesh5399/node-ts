import { Request, Response } from "express";
import { errorObj, successObj } from "../../utils/helper";

export const login = (request: Request, response: Response) => {
  try {
    return response.status(200).send(
      successObj({
        message: "Login successfully!",
      })
    );
  } catch (error: any) {
    return response.status(500).send(
      errorObj({
        message: error?.message || "Something went wrong!",
      })
    );
  }
};

export const signUp = (request: Request, response: Response) => {
  try {
    return response.status(200).send(
      successObj({
        message: "Signup successfully!",
      })
    );
  } catch (error: any) {
    return response.status(500).send(
      errorObj({
        message: error?.message || "Something went wrong!",
      })
    );
  }
};
