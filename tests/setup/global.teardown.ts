import { Logger } from "../../../../common/logger";

//////////////////////////////////////////////////////////////////////////////////

export default async () => {
    try {

        //logger.log("Tearing down...");
    }
    catch (error) {
        logger.log('Problem in tearing down the tests! -> ' + error.message);
    }
};

