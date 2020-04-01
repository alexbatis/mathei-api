import * as dotenv from "dotenv";
import * as fs from "fs";
import { logger } from "@common";
import "./env";

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as "dev"
export const MONGODB_URI = prod ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];

