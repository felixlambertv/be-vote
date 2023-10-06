import app from "./config/app";
import mongoose from "mongoose";
import { config } from "./config/vars";

const startServer = async () => {
  try {
    const db = await mongoose.connect(config.dbUrl);
    console.log("Connected to mongo");

    const server = app.listen(config.port, () => {
      console.log(`server is running at ${config.host}:${config.port}`);
    });

    const gracefulShutdown = async () => {
      try {
        console.log("Gracefully shutting down...");

        // Close the Express server
        server.close(async () => {
          console.log("Closed out remaining connections.");
          // Close the MongoDB connection
          await db.disconnect();
        });
      } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
      }
    };

    // Listen for termination signals
    process.on("SIGTERM", gracefulShutdown); // on "terminate"
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("Error:", error);
  }
};
startServer();
