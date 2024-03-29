import * as dotenv from "dotenv";

import * as path from 'path';

import { logger } from "../../../../common/logger";
import { TestLoader } from '../test.loader';
import {} from 'jest';

//////////////////////////////////////////////////////////////////////////////////

export default async () => {
    try {

        const envPath = path.join(process.cwd(), '.env');
        dotenv.config({ path: envPath });

        //logger.log(process.env.GOOGLE_APPLICATION_CREDENTIALS);
        await TestLoader.init();

        //jest.setTimeout(30000);
    }
    catch (error) {
        logger.log('Problem in setting up the tests! -> ' + error.message);
    }
};

// const envPath = path.join(process.cwd(), '.env');
//dotenv.config();
