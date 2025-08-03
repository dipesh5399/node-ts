import express, { Request, Response } from "express";
import winston from "winston";
import startup from "./startup/index";

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  return res.status(200).send({
    message: "App running successfully.",
  });
});

let server = require("http").createServer(app);

server.listen(PORT, () => {
  winston.info(
    `The application has booted, follow the link for doc : ${process.env.API_URL}/api-docs`
  );
  startup(app);
});
