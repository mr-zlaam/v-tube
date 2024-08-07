import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { DATA_LIMIT } from "../CONSTANTS";
import { CORS_ORIGIN } from "../config";
import { errorHandler, notFoundHandler } from "../middlewares/error.middleware";
const app = express();

app.use(bodyParser.json({ limit: DATA_LIMIT }));
app.use(
  bodyParser.urlencoded({
    limit: DATA_LIMIT,
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cookieParser());
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.static("public"));
//Routes
import userRouter from "../routes/userRoutes/user.routes";
//routes declaration
app.use("/api/v1/users", userRouter);
app.use(notFoundHandler);
app.use(errorHandler);
export { app };
