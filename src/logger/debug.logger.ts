import { createLogger, format, transports, Logger } from 'winston';
const { combine, timestamp, printf } = format;

//import DailyRotateFile from 'winston-daily-rotate-file';

//Daily rotate log file
// var dailyRotateFileTransport = new transports.DailyRotateFile({
//     filename      : 'application-%DATE%.log',
//     datePattern   : 'YYYY-MM-DD-HH',
//     zippedArchive : true,
//     maxSize       : '30m',
//     maxFiles      : '14d'
// });

//Use own format instead of json
// const debugFormat = printf(({ level, message, timestamp }) => {
//     return `${timestamp} ${level}: ${message}`;
// });

const debugLogger: Logger = createLogger({
    level  : 'debug',
    format : combine(
        format.colorize(),
        timestamp(),
        //debugFormat,
        format.json()
    ),
    transports : [
        new transports.Console(),
        new transports.File({ filename: '../../logs/debug.log', level: 'debug' }),
        //dailyRotateFileTransport
    ]
});

export default debugLogger;
