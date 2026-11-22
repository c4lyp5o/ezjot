import { LOG_DIR } from "./config";
import { createLogger } from "./ezlog.js";

export const generalLogger = createLogger(LOG_DIR, "ezjot");
