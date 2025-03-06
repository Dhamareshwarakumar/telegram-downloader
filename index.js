import './config/ApplicationManager.js'; // THIS SHOULD BE THE FIRST IMPORT
import logger from './config/LogManager.js';

const handler = async (event) => {
    logger.info('Application started');
    logger.info(`Received event:`, JSON.parse(event));
    await new Promise((resolve) => setTimeout(resolve, 30000000));
};

handler(process.env.EVENT);
