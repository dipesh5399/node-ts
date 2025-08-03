const mongoose = require("mongoose");
const winston = require("winston");

const MongooseConfiguration = () =>
  new Promise((resolve, reject) => {
    let connection_url = process.env.DB_CONNECTION;

    mongoose
      .connect(connection_url, {
        useNewURLParser: true,
        useUnifiedTopology: true,
      })
      .then(async () => {
        winston.info(`Connected to ${connection_url} ...`);
        resolve(1);
      })
      .catch(reject);
  });

export default MongooseConfiguration;
