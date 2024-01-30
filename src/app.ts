import "dotenv/config";
import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import { requestIntercepter } from "./utils/requestIntercepter";
import mainRouter from "./routes/mainRoutes";
import passport from "passport";
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.all("*", requestIntercepter);
app.use("/", mainRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    console.log("🚀 ~ file: app.ts:18 ~ err:", err);
    res.status(err.status ?? 400);
    res.json({ error: err.message ?? "Ocorreu algum erro." });
};
app.use(errorHandler);

export default app;
