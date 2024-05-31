import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { CORS_ORIGIN } from "../config";
import { DATA_LIMIT } from "../CONSTANTS";
export const app = express();

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
