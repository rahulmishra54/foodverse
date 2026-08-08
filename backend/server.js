import dotenv from "dotenv";
dotenv.config({ path: "./.env" });




import app from "./src/app.js";
import connectDB from "./src/db/db.js";

connectDB();

app.listen(3000, () => {
  console.log("server is running on 3000");
});