import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./config";

let server: Server;

async function main() {
  try {
    const dbConnection = await mongoose.connect(config.MONGO_URI as string);
    // console.log(dbConnection.connection.host);
    console.log("Connected to database");

    // start server
    server = app.listen(config.PORT, () => {
      console.log(`Server running on port ${config.PORT}`);
    });
  } catch (error) {
    // log any errors that occur during server startup
    console.log(error);
  }
}

// call the main function
main();

// handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  console.log(
    "😡unhandledRejection: Error name: ",
    err.name,
    " Message: ",
    err.message
  );

  console.log("Server shutting down...");

  // close server
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// handle uncaught exceptions
process.on("uncaughtException", (err: any) => {
  console.log(
    "😡uncaughtException: Error name: ",
    err.name,
    " Message: ",
    err.message
  );
  console.log("Server shutting down...");

  // close server
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
