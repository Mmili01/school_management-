import express from "express";
import { connection } from "./db/connectpg";
import * as dotenv from "dotenv";
import authrouter from "./routes/authRoutes";
import departmentRouter from "./routes/departmentRouter";
import facultyRouter from "./routes/facultyRoutes";
import lecturerRouter from "./routes/lecturerRoutes";

dotenv.config();
const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/authroute", authrouter);
app.use("/department", departmentRouter);
app.use("/faculty", facultyRouter);
app.use("/lecturer", lecturerRouter);
const start = async () => {
  try {
    await connection();
    console.log("it has connected oo");
    app.listen(port, () => {
      console.log(`app connected on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
