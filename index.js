import configManager from './config/ConfigManager.js';
import applicationManager from './config/ApplicationManager.js';
import logger from './config/LogManager.js';

(async () => {
    // Bootstrapping the application
    await applicationManager.init();
    configManager.init();

    logger.info('Application started');
    await new Promise((resolve) => setTimeout(resolve, 30000000));
})();
