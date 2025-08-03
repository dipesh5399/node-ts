import { Express, Router } from "express";
import userRoutes from "../api/routes/user.routes";

const AppRoutes = (app: Express) =>
  new Promise((resolve, reject) => {
    app.use("/api", Router().use("/user", userRoutes));
    resolve(1);
  });

export default AppRoutes;
