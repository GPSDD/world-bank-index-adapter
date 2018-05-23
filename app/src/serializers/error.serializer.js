class ErrorSerializer {

    static serializeError(status, message) {
        return {
            errors: [{
                status,
                detail: message
            }]
        };
    }

}

module.exports = ErrorSerializer;
