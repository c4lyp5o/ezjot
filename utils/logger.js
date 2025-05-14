import deadslog from "deadslog";

const logger = deadslog({
	fileOutput: {
		enabled: true,
		logFilePath: "./logs/ezjot.log",
	},
});

export default logger;
