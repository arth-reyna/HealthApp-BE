import { createLogger, format, transports } from "winston";

const tstamp = format.timestamp();

export const logger = createLogger({
  level: "silly",
  format: format.combine(tstamp, format.json()),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: "logger/combined.log",
      maxsize: 5 * 1024 * 1024,
    }),
    new transports.File({
      filename: "logger/workflow.log",
      level: "info",
      maxsize: 5 * 1024 * 1024
    })
  ],
});

