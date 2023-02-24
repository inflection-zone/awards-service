import * as cron from 'node-cron';
import * as CronSchedules from '../../seed.data/cron.schedules.json';
import { logger } from '../logger/logger';

///////////////////////////////////////////////////////////////////////////

export class Scheduler {

    //#region Static privates

    private static _instance: Scheduler = null;

    private static _schedules = null;

    private constructor() {
        const env = process.env.NODE_ENV || 'development';
        Scheduler._schedules = CronSchedules[env];
        logger.info('Initializing the schedular.');
    }

    //#endregion

    //#region Publics

    public static instance(): Scheduler {
        return this._instance || (this._instance = new this());
    }

    public schedule = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {

                this.scheduleDailyReminders();

                resolve(true);
            } catch (error) {
                logger.error('Error initializing the scheduler.: ' + error.message);
                reject(false);
            }
        });
    };

    //#endregion

    //#region Privates

    private scheduleDailyReminders = () => {
        cron.schedule(Scheduler._schedules['DailyReminder'], () => {
            logger.info('Running scheducled jobs: Daily reminders...');
            // (async () => {
            // var service = Loader.container.resolve(UserTaskService);
            // await service.sendTaskReminders();
            // })();
        });
    };

    //#endregion

}
