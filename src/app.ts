import express, { Request, Response } from "express";
import responseTime from "response-time";
import dotenv from "dotenv";
dotenv.config();
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import config from "config"
import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";
import swaggerDocs from "./utils/swagger";

const admin = require('firebase-admin');
const fcmJson = process.env.FCM_JSON;
if (!fcmJson) {
  throw new Error("SECRET_JSON is not defined in the environment variables");
}
const serviceAccount = JSON.parse(fcmJson);

// const serviceAccount = require('../file/my-project-1-27717-1034408269f9.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Ensure NODE_CONFIG_DIR is set or default to './config'
const configDir = process.env.NODE_CONFIG_DIR || './config';

// Access environment-specific values (example)
const port = process.env.PORT || config.get("port");

const app = express();

app.use(express.json());

// app.use(deserializeUser);

app.use(
  responseTime((req: Request, res: Response, time: number) => {
    if (req?.route?.path) {
      restResponseTimeHistogram.observe(
        {
          method: req.method,
          route: req.route.path,
          status_code: res.statusCode,
        },
        time * 1000
      );
    }
  })
);

routes(app);

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  routes(app);

  // startMetricsServer();

  // swaggerDocs(app, port);
});

export default app;
