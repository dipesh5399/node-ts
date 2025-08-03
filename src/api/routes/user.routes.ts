import { Router } from "express";
import * as userController from "../controllers/user.controller";
import * as userValidator from "../validators/user.validators";

const userRoutes = Router()
  .post("/signup", userController.signUp)
  .post("/login", userValidator.loginValidator, userController.login);

export default userRoutes;
