import 'dotenv/config';
import ApiException from '../utils/ApiException.js';
import { ENV_VARS } from '../utils/constants/envVars.js';
import { EMAIL_REGEX, PHONE_REGEX } from '../utils/constants/regex.js';

class ConfigManager {
    #config = {};

    constructor() {
        Object.keys(ENV_VARS).forEach((key) => {
            this.#config[key] = process.env[key];
        });
    }

    validate() {
        let invalidEnvVars = {};

        Object.keys(ENV_VARS).forEach((envVar) => {
            if (ENV_VARS[envVar].required && !this.#config[envVar]) {
                invalidEnvVars[envVar] = 'Missing value';
            } else if (ENV_VARS[envVar].default !== undefined && !this.#config[envVar]) {
                this.#config[envVar] = ENV_VARS[envVar].default;
            } else if (ENV_VARS[envVar].type === 'number') {
                if (isNaN(this.#config[envVar])) {
                    invalidEnvVars[envVar] = 'Invalid value, expected number';
                }
                this.#config[envVar] = Number(this.#config[envVar]);
            } else if (ENV_VARS[envVar].type === 'boolean') {
                if (this.#config[envVar] !== 'true' && this.#config[envVar] !== 'false') {
                    invalidEnvVars[envVar] = 'Invalid value, expected boolean (true/false)';
                }
                this.#config[envVar] = this.#config[envVar] === 'true';
            } else if (ENV_VARS[envVar].type === 'array') {
                if (!Array.isArray(this.#config[envVar]) && typeof this.#config[envVar] !== 'string') {
                    invalidEnvVars[envVar] = 'Invalid value, expected array/comma separated string';
                } else if (typeof this.#config[envVar] === 'string') {
                    this.#config[envVar] = this.#config[envVar].split(',').map((item) => item.trim());
                }
            } else if (ENV_VARS[envVar].type === 'email') {
                if (!EMAIL_REGEX.test(this.#config[envVar])) {
                    invalidEnvVars[envVar] = 'Invalid value, expected email';
                }
            } else if (ENV_VARS[envVar].type === 'phone') {
                if (!PHONE_REGEX.test(this.#config[envVar])) {
                    invalidEnvVars[envVar] = 'Invalid value, expected phone number';
                }
            }
        });

        if (Object.keys(invalidEnvVars).length > 0) {
            throw new ApiException(`Error parsing environment variables: ${JSON.stringify(invalidEnvVars, null, 2)}`);
        }
    }

    get(key) {
        return this.#config[key];
    }

    set(key, value) {
        this.#config[key] = value;
    }
}

export default new ConfigManager();
