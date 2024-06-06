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

app.listen(port, async () => {
  logger.info(`App is running at http://localhost:${port}`);

  await connect();

  routes(app);

  // startMetricsServer();

  // swaggerDocs(app, port);
});
