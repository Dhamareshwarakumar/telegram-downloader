// TODO: implement a type to validate phone number & email
// TODO: implement to taka validate function to validate the value (ex either STRING_SESSION required | (PHONE_NUMBER & PASSWORD) required)

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
    STACK_TRACE_API_EXCEPTION: {
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
    PHONE_NUMBER: {
        type: 'string',
        required: true,
    },
    PASSWORD: {
        type: 'string',
        required: true,
    },
};
