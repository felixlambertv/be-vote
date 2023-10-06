import bodyParser from "body-parser";
import express, { Express } from "express";
import cors from "cors";
import bindRoutes from "./router";
import helmet from "helmet";

const app: Express = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bindRoutes());

export default app;
