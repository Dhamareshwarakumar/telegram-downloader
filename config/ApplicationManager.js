import logger from './LogManager.js';
import config from './ConfigManager.js';
import ApiException from '../utils/ApiException.js';

class ApplicationManager {
    #createdAt;
    #isShuttingDown;

    constructor() {
        logger.info(`Bootstrapping Application. (pid: ${process.pid})`);
        if (!globalThis.singletons) {
            logger.debug(`Reserving "globalThis.singletons", Please DO NOT DELETE/REASSIGN this variable`);
            globalThis.singletons = {};
        }
        if (!globalThis.singletons.ApplicationManager) {
            globalThis.singletons.ApplicationManager = this;
            this.#createdAt = new Date();
            this.#isShuttingDown = false;
            this.#init();
        }

        return globalThis.singletons.ApplicationManager;
    }

    #init() {
        ['SIGINT', 'SIGTERM'].forEach((signal) => {
            process.on(signal, async () => {
                await this.#gracefulShutdown(`Received ${signal} signal`);
            });
        });

        ['unhandledRejection', 'uncaughtException'].forEach((event) => {
            process.on(event, async (error) => {
                if (error instanceof ApiException) {
                    logger.error(error);
                } else {
                    logger.error(event, error);
                    // notifyTeam()
                }
                await this.#gracefulShutdown(error instanceof ApiException ? 'API Exception' : event);
            });
        });

        process.on('SIGQUIT', async () => {
            await this.#forceShutdown('Received SIGQUIT');
        });

        process.on('exit', (code) => {
            logger.info(`Application exited with code ${code}`);
        });

        config.validate();
    }

    async #gracefulShutdown(msg) {
        if (this.#isShuttingDown) {
            logger.warn(`${msg}: Graceful shutdown is already in progress`);
            logger.info('Send SIGQUIT/SIGKILL to force shutdown');
            return;
        }

        this.#isShuttingDown = true;
        logger.info(`${msg}: Starting graceful shutdown...`);

        const shutdownTimeout = setTimeout(
            async () => {
                await this.#forceShutdown('Graceful shutdown timed out. Forcing shutdown...');
            },
            config.get('SHUTDOWN_TIMEOUT') || 30000,
        );

        try {
            // Perform cleanup tasks here
            await new Promise((resolve) => setTimeout(resolve, 3000));
            clearTimeout(shutdownTimeout);
            process.exit(0);
        } catch (error) {
            this.#forceShutdown('Cleanup failed. Forcing shutdown...');
        }
    }

    async #forceShutdown(msg) {
        logger.info(`Forcing shutdown: ${msg}`);
        logger.info('App status:', this.getStatus());
        process.exit(1);
    }

    getStatus() {
        return {
            createdAt: this.#createdAt,
            uptime: new Date() - this.#createdAt,
            isShuttingDown: this.#isShuttingDown,
            pid: process.pid,
            memoryUsage: process.memoryUsage(),
        };
    }

    get isShuttingDown() {
        return this.#isShuttingDown;
    }
}

export default new ApplicationManager();
