import pino from 'pino';
import config from './config';

const pinoConfig = {
  level: config.logLevel,
  transport:
    config.isDevelopment
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        }
      : undefined,
};

export const logger = pino(pinoConfig);

export default logger;
