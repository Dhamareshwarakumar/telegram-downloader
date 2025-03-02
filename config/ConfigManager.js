import 'dotenv/config';
import ApiException from '../utils/ApiException.js';
import { ENV_VARS } from '../utils/constants.js';

class ConfigManager {
    static instance = null;
    #config = {};

    constructor() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = this;
        }
        return ConfigManager.instance;
    }

    init() {
        this.validateEnvVars();
    }

    validateEnvVars() {
        let missingEnvVars = [];

        Object.keys(ENV_VARS).forEach((envVar) => {
            // TODO: Check the scope of improvement
            if (ENV_VARS[envVar].required && !process.env[envVar]) {
                missingEnvVars.push(envVar);
            } else if (ENV_VARS[envVar].default !== undefined && !process.env[envVar]) {
                this.#config[envVar] = ENV_VARS[envVar].default;
            } else if (ENV_VARS[envVar].type === 'number') {
                this.#config[envVar] = parseInt(process.env[envVar]);
            } else if (ENV_VARS[envVar].type === 'boolean') {
                this.#config[envVar] = process.env[envVar] === 'true';
            } else {
                this.#config[envVar] = process.env[envVar];
            }
        });

        if (missingEnvVars.length > 0) {
            throw new ApiException(`Missing environment variables: ${missingEnvVars.join(', ')}`);
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
