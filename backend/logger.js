import path from "node:path";
import { mkdirSync } from "node:fs";
import deadslog from "deadslog";
import { LOG_DIR } from "./config";

// Make sure the log dir exists even on a fresh checkout / container.
mkdirSync(LOG_DIR, { recursive: true });

export const generalLogger = deadslog({
	consoleOutput: {
		enabled: true,
		coloredCoding: true,
	},
	fileOutput: {
		enabled: true,
		logFilePath: path.join(LOG_DIR, "ezjot.log"),
	},
});
