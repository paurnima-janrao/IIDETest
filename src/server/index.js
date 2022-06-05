const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({
  path: "./config/config.env"
});

app.use(express.json());

//Setup cors Accessible by other domains
app.use(cors());

const PORT = 9000;

const crud = require("./routes/crud");

//routes
app.use("/api/v1", crud);

const server = app.listen(PORT, () => {
  console.log("Connected to " + PORT + " port, in " + process.env.NODE_ENV + " mode");
});

// Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on("JsonWebTokenError", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});