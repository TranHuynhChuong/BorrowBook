class ApiError extends Error {
    constructor(stateCode, message) {
        super();
        this.stateCode = stateCode;
        this.message = message;
    }
}

module.exports = ApiError;
