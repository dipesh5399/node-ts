import express, { Express } from "express";
import actuator from "express-actuator";
import expressFileUpload from "express-fileupload";
import cors from "cors";
import configureMongoose from "./mongoose";
import routes from "./routes";
import errorHandler from "./errorHandler";

const bindCommonServices = (appConfig: Express) => {
  return new Promise((resolve, reject) => {
    appConfig.use(express.static("public"));
    appConfig.use(express.json());
    appConfig.use(express.urlencoded({ extended: true }));
    /* use cors */
    appConfig.use(cors());

    const options: any = {
      infoGitMode: "full",
    };
    appConfig.use(actuator(options));

    appConfig.use(
      expressFileUpload({
        limits: {
          fileSize: 10 * 1024 * 1024,
        },
      })
    );
    resolve(1);
  });
};

const startup = (app: Express) =>
  configureMongoose().then(() =>
    bindCommonServices(app)
      .then(() => routes(app))
      .then(() => errorHandler(app))
  );

export default startup;
