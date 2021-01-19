const connectDb = require("./connectDB");
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });
connectDb();
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`app is running on port ${PORT}`));

process.on("SIGTERM", () => {
  console.log("SIGTERM RECIEVED");
  server.close(() => {
    console.log("shutting down");
  });
});
