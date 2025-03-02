import ApiException from '../utils/ApiException.js';
import logger from './LogManager.js';

class ApplicationManager {
    static instance = null;
    #isShuttingDown = false;

    constructor() {
        if (!ApplicationManager.instance) {
            ApplicationManager.instance = this;
        }

        return ApplicationManager.instance;
    }

    async init() {
        ['SIGINT', 'SIGTERM'].forEach((signal) => {
            process.on(signal, async () => {
                await this.gracefulShutdown('Received ' + signal);
            });
        });

        ['unhandledRejection', 'uncaughtException'].forEach((event) => {
            process.on(event, async (error) => {
                if (!(error instanceof ApiException)) {
                    logger.error(`${event}:`, error);
                    // notifyTeam();
                } else {
                    logger.error(error);
                }
                await this.gracefulShutdown(event);
            });
        });

        process.on('SIGQUIT', async () => {
            await this.forceShutdown('Received SIGQUIT');
        });
    }

    async gracefulShutdown(msg) {
        if (this.#isShuttingDown) {
            console.log(`${msg}: Graceful Shutdown already in progress.`);
            console.log('Send SIGQUIT/SIGKILL to force shutdown');
            return;
        }

        this.#isShuttingDown = true;
        logger.info(`${msg}: Starting graceful shutdown...`);

        const shutdownTimeout = setTimeout(async () => {
            await this.forceShutdown('Graceful shutdown timed out. Forcing exit.');
        }, process.env.SHUTDOWN_TIMEOUT || 30000);

        try {
            // Perform cleanup tasks
            await new Promise((resolve) => setTimeout(resolve, 3000));
            clearTimeout(shutdownTimeout);
            process.exit(0);
        } catch (error) {
            logger.error('Cleanup failed:', error);
            process.exit(1);
        }
    }

    async forceShutdown(reason) {
        logger.info(`Forcing shutdown: ${reason}`);
        process.exit(1);
    }

    get isShuttingDown() {
        return this.#isShuttingDown;
    }
}

export default new ApplicationManager();
