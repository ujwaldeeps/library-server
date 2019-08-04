class SuccessResponse {
    constructor(status, data, msg = undefined) {
        this.status = status;
        this.data = data;
        this.msg = msg;
    }

    getStatus() {
        return this.status;
    }

    getPayload() {
        return {
            statue: 'success',
            status_code: this.status,
            data: this.data,
            message: this.msg,
        }
    }

}

module.exports = SuccessResponse;