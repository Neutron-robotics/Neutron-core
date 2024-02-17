/* eslint-disable no-console */
import moment from 'moment';
import { LiteEvent } from './LiteEvent';
import { isBlank } from './string';

export interface ILoggerMessage {
  _id?: string;
  source?: string;
  content: string;
  type: LogType;
  time: Date;
}

// export enum LogType {
//   DEBUG = "#4f5051",
//   ERROR = "#d81a1a",
//   INFO = "#387a30",
//   WARNING = "#d17e32",
// }

export enum LogType {
  DEBUG = 'DEBUG',
  ERROR = 'ERROR',
  INFO = 'INFO',
  WARNING = 'WARNING',
}

export class Logger {
  private source: string;

  private readonly onLog = new LiteEvent<ILoggerMessage>();

  constructor(source: string) {
    this.source = source;
  }

  public get OnLog() {
    return this.onLog.expose();
  }

  public log(message: string, type: LogType) {
    if (!isBlank(this.source)) {
      this.onLog.trigger({
        type,
        content: message,
        source: this.source,
        time: new Date()
      });
      console.log(`%c[${moment().format('LTS')}][${this.source}] ${message}`);
    } else {
      this.onLog.trigger({
        type,
        content: message,
        time: new Date()
      });
      console.log(`%c[${moment().format('LTS')}] ${message}`);
    }
  }

  public logDebug(message: string) {
    this.log(message, LogType.DEBUG);
  }

  public logError(message: string) {
    this.log(message, LogType.ERROR);
  }

  public logInfo(message: string) {
    this.log(message, LogType.INFO);
  }

  public logWarning(message: string) {
    this.log(message, LogType.WARNING);
  }
}
