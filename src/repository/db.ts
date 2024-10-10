import mongoose from "mongoose";
import config from "../config/db_config";

const ENV: string | undefined = process.env.NODE_ENV;
let dbUrl = config.dbUrl.dev;

if (ENV === "staging") {
  dbUrl = encodeURI(config.dbUrl.staging);
}

if (ENV === "production") {
  dbUrl = encodeURI(config.dbUrl.prod);
}

mongoose
  .connect(dbUrl, {
    dbName: process.env.DB_NAME,
  })
  .then((connection) => {
    console.log("DB Connected");
  })
  .catch((error) => {
    console.log("DB Error", error);
  });

mongoose.connection.on("connected", function () {
  console.log("MongoDB: connected - ");
});
mongoose.connection.on("error", function (err) {
  console.log("MongoDB: connection error! ", err);
});
mongoose.connection.on("disconnected", function () {
  console.log("MongoDB: disconnected!");
});

// For nodemon restarts
process.once("SIGUSR2", function () {
  gracefulShutdown("nodemon restart", function () {
    process.kill(process.pid, "SIGUSR2");
  });
});

// For app termination
process.on("SIGINT", function () {
  gracefulShutdown("app termination", function () {
    process.exit(0);
  });
});

import "./models/index";

function gracefulShutdown(arg0: string, arg1: () => void) {
  throw new Error("Function not implemented.");
}
