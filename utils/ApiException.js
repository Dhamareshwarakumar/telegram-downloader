import config from '../config/ConfigManager.js';

class ApiException extends Error {
    constructor(message) {
        super(message);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);

        if (!config.STACK_TACE_API_EXCEPTION) {
            this.stack = null;
        }
    }
}

export default ApiException;
