import config from './ConfigManager.js';

class LogManager {
    #logLevels;
    #logLevel;

    constructor() {
        this.#logLevels = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
        };

        this.#logLevel = this.#logLevels[config.get('LOG_LEVEL') || 'DEBUG'];
    }

    log(level, ...messages) {
        if (this.#logLevels[level] >= this.#logLevel) {
            const formattedMessage = this.formatMessage(level, ...messages);
            console.log(formattedMessage);
        }
    }

    debug(...message) {
        this.log('DEBUG', ...message);
    }

    info(...message) {
        this.log('INFO', ...message);
    }

    warn(...message) {
        this.log('WARN', ...message);
    }

    error(...message) {
        this.log('ERROR', ...message);
    }

    formatMessage(level, ...messages) {
        const timestamp = new Date().toISOString();

        const message = messages
            .map((msg) => {
                if (msg instanceof Error) {
                    return msg.stack || `${msg.name}: ${msg.message}`;
                } else if (typeof msg === 'object') {
                    return JSON.stringify(msg, null, 2);
                }

                return msg;
            })
            .join(' ');

        return `[${process.pid}] [${timestamp}] [${level}]: ${message}`;
    }
}

export default new LogManager();
