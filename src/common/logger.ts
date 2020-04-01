import * as pino from "pino";

export const logger = pino({
  name: process.env.APP_ID,
  prettyPrint: { forceColor: true },
  timestamp : pino.stdTimeFunctions.nullTime
});

