export const ENV_VARS = {
    API_ID: {
        type: 'number',
        required: true,
    },
    API_HASH: {
        type: 'string',
        required: true,
    },
    STRING_SESSION: {
        type: 'string',
        required: false,
    },
    STACK_TACE_API_EXCEPTION: {
        type: 'boolean',
        required: false,
        default: false,
    },
    SHUTDOWN_TIMEOUT: {
        type: 'number',
        required: false,
        default: 30000,
    },
    LOG_LEVEL: {
        type: 'string',
        required: false,
        default: 'info',
    },
};
