import { TelegramClient } from 'telegram';
import { StringSession } from 'telegram/sessions/index.js';

class TelegramManager {
    static instance = null;
    client = null;

    constructor() {
        if (!TelegramManager.instance) {
            TelegramManager.instance = this;
        }

        return TelegramManager.instance;
    }

    init() {
        try {
            const apiId = Number(process.env.API_ID);
            const apiHash = process.env.API_HASH;
            const stringSession = new StringSession(process.env.STRING_SESSION);

            this.client = new TelegramClient(stringSession, apiId, apiHash, {
                connectionRetries: 5,
            });
        } catch (error) {}
    }
}

export default new TelegramManager();
