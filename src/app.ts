import express, { Request, Response } from "express";
import responseTime from "response-time";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import { restResponseTimeHistogram, startMetricsServer } from "./utils/metrics";
import swaggerDocs from "./utils/swagger";

const defaultConfig = require("./config/default.json");
let environmentConfig = {};

if (process.env.NODE_ENV) {
  environmentConfig = require(`./config/${process.env.NODE_ENV}.json`);
}

const finalConfig = Object.assign({}, defaultConfig, environmentConfig);

const port = finalConfig.get("port");

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
