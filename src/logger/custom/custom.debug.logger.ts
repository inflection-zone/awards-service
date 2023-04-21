/* eslint-disable no-console */
import chalk from 'chalk';
import { AbstrctCustomLogger } from './abstract.custom.logger';

///////////////////////////////////////////////////////////////////////

export class CustomDebugLogger extends AbstrctCustomLogger {

    constructor() {
        super();
    }

    info = (str: string) => {
        const dateTime = new Date().toISOString();
        if (this._useConsole) {
            const str_ = chalk.hex('#AEADED')(`[${dateTime}] `) + chalk.bold.bgCyanBright(' INFO ') + ' ' + chalk.gray(str);
            console.log(chalk.green(str_));
        }
        else {
            const str_ = `[${dateTime}]  INFO  ${str}`;
            this._stream.write(str_);
        }
    };

    error = (str: string) => {
        const dateTime = new Date().toISOString();
        if (this._useConsole) {
            const str_ = chalk.hex('#AEADED')(`[${dateTime}] `) + chalk.bold.bgRedBright(' ERROR ') + ' ' + chalk.gray(str);
            console.log(chalk.red(str_));
        }
        else {
            const str_ = `[${dateTime}]  ERROR  ${str}`;
            this._stream.write(str_);
        }
    };

    warn = (str: string) => {
        const dateTime = new Date().toISOString();
        if (this._useConsole) {
            const str_ = chalk.hex('#AEADED')(`[${dateTime}] `) + chalk.bold.bgYellowBright(' WARN ') + ' ' + chalk.gray(str);
            console.log(chalk.yellow(str_));
        }
        else {
            const str_ = `[${dateTime}]  WARN  ${str}`;
            this._stream.write(str_);
        }
    };

    debug = (str: string) => {
        const dateTime = new Date().toISOString();
        if (this._useConsole) {
            const str_ = chalk.hex('#AEADED')(`[${dateTime}] `) + chalk.bold.bgBlueBright(' DEBUG ') + ' ' + chalk.gray(str);
            console.log(chalk.blue(str_));
        }
        else {
            const str_ = `[${dateTime}]  DEBUG  ${str}`;
            this._stream.write(str_);
        }
    };

}
