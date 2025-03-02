class LogManager {
    static instance = null;
    #logLevels;
    #logLevel;

    constructor() {
        if (LogManager.instance) {
            return LogManager.instance;
        }

        this.#logLevels = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
        };

        this.#logLevel = this.#logLevels.INFO;

        LogManager.instance = this;
    }

    set logLevel(level) {
        if (this.#logLevels[level]) {
            this.#logLevel = this.#logLevels[level];
        }
    }

    formatMessage(level, ...messages) {
        const message = messages
            .map((msg) => {
                if (msg instanceof Error) {
                    return msg.stack || `${msg.name}: ${msg.message}`;
                } else if (typeof msg === 'object') {
                    return JSON.stringify(msg);
                }
                return msg;
            })
            .join(' ');

        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}]: ${message}`;
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
}

export default new LogManager();
