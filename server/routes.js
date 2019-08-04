const BooksController = require('./controllers/BooksController/index');

module.exports = function (app) {

    /*Route: GET root*/
    app.get('/', (req, res) => {
        res.send('Welcome to Get Job Set Server');
    });

    app.get('/external-books', BooksController.getIceAndFireBooks);

    app.get('/v1/books', BooksController.getBooks);

    app.post('/v1/books', BooksController.postNewBook);

    app.patch('/v1/books/:id', BooksController.updateBook);

    app.delete('/v1/books/:id', BooksController.deleteBook);

    return app;

};