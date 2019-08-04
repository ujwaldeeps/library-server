const Books = require("./Books");

module.exports = {
    async postNewBook(req, res) {
        await new Books(req, res).postNewBook();
    },
    async getIceAndFireBooks(req, res) {
        await new Books(req, res).getIceAndFireBooks();
    },
    async getBooks(req, res) {
        await new Books(req, res).getBooks();
    },
    async updateBook(req, res) {
        await new Books(req, res).updateBook();
    },
    async deleteBook(req, res) {
        await new Books(req, res).deleteBook();
    },
};
