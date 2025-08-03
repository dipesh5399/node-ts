import { Request, Response, Express } from "express";
import { ValidationError } from "express-validation";
import bodyParser from "body-parser";

const errorHandler = (app: Express) =>
  new Promise((resolve, reject) => {
    try {
      app.use(bodyParser.json());
      app.use((err: any, req: Request, res: Response, next: VoidFunction) => {
        if (err instanceof ValidationError) {
          return res.status(err.statusCode).json(err);
        }
        return res.status(500).json(err);
      });
    } catch (e) {
      reject(e);
    }
  });

export default errorHandler;
