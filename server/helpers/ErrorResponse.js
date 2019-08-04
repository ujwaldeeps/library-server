class ErrorResponse {
    constructor(status, msg) {
        this.status = status;
        this.msg = msg;
    }

    getStatus() {
        return this.status;
    }

    getPayload() {
        return {
                status: 'failure',
                status_code: this.status,
                message: this.msg
        }
    }
}
module.exports = ErrorResponse;