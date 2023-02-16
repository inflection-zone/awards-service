import { Logger } from "winston";
import debugLogger from "./debug.logger";
import productionLogger from "./prod.logger";

var logger:Logger = debugLogger;

if (process.env.NODE_ENV === 'production') {
    logger = productionLogger;
}

export default logger;
