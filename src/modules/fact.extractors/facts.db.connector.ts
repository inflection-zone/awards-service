/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { Config } from './../../database/database.config';
import { logger } from '../../logger/logger';
import { DataSource } from "typeorm";
import { BadgeFact } from './models/bedge.facts.model';
import { MedicationFact } from './models/medication.fact.model';
import { DBLogger } from "./../../database/database.logger";
import { NutritionChoiceFact } from "./models/nutrition.choice.fact.model";
import { ExercisePhysicalActivityFact } from "./models/exercise.physical.activity.fact.model";
import { VitalFact } from "./models/vital.fact.model";

///////////////////////////////////////////////////////////////////////////////////
const DATABASE_NAME = `awards_facts`;
///////////////////////////////////////////////////////////////////////////////////

class FactsDatabaseConnector {

    static _source = new DataSource({
        name        : Config.dialect,
        type        : Config.dialect,
        host        : Config.host,
        port        : Config.port,
        username    : Config.username,
        password    : Config.password,
        database    : DATABASE_NAME,
        synchronize : true,
        //entities    : [this._basePath + '/**/**{.model.ts}'],
        entities    : [
            MedicationFact,
            BadgeFact,
            NutritionChoiceFact,
            ExercisePhysicalActivityFact,
            VitalFact
        ],
        migrations  : [],
        subscribers : [],
        //logger      : 'advanced-console', //Use console for the typeorm logging
        logger      : new DBLogger(),
        logging     : true,
        poolSize    : Config.pool.max,
        cache       : true,
    });

    static initialize = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            this._source
                .initialize()
                .then(() => {
                    logger.info('Database connection has been established successfully.');
                    resolve(true);
                })
                .catch(error => {
                    logger.error('Unable to connect to the database:' + error.message);
                    reject(false);
                });
        });
    };

}

///////////////////////////////////////////////////////////////////////////////////

const FactsSource = FactsDatabaseConnector._source;

export { FactsDatabaseConnector as FactsDBConnector, FactsSource };
