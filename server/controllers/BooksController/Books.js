const { Book, Author, written_by } = require("../../../models");
const ErrorResponse = require("../../helpers/ErrorResponse");
const SuccessResponse = require("../../helpers/SuccessResponse");
const axios = require('axios');

class Books {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }

    async getBooks(id) {
        try {

            const queryResult = await Book.findAll({
                    include: [
                        {
                            model: Author,
                        },
                    ]
                }
            );

            const books = queryResult.map((book)=>{
                console.log(book);
                return {
                    id: book.id,
                    name: book.name,
                    isbn: book.isbn,
                    release_date: book.release_date,
                    publisher: book.publisher,
                    number_of_pages: book.number_of_pages,
                    country: book.country,
                    authors: book.Authors ? book.Authors.map(author => {
                        return author.name;
                    }) : [],
                }
            });
            const response = new SuccessResponse(200, books);
            this.res.status(response.getStatus()).send(response.getPayload());
        } catch (err) {
            console.log(err);
            const response = new ErrorResponse(200, "Something went wrong");
            this.res.status(response.getStatus()).send(response.getPayload());
        }
    }

    async getIceAndFireBooks() {
        try {
            const params = {};
            if(this.req.query.name)
                params['name'] = this.req.query.name;
            const bookResponse = await axios.get('https://www.anapioficeandfire.com/api/books', {
                    params
                }
            );
            const data = bookResponse.data;
            const books = data.map((book) => {
                return {
                    name: book.name,
                    release_date: book.released,
                    country: book.country,
                    publisher: book.publisher,
                    number_of_pages: book.numberOfPages,
                    authors: book.authors,
                    isbn: book.isbn,

                }
            });

            const response = new SuccessResponse(200, books);
            this.res.status(response.getStatus()).send(response.getPayload());
        } catch (err) {
            const response = new ErrorResponse(200, "Something went wrong");
            this.res.status(response.getStatus()).send(response.getPayload());
        }
    }

    async updateBook() {
        try {
            if(!this.req.params.id) {
                const response =new ErrorResponse(422, `Missing Parameter id`);
                this.res.status(response.getStatus()).send(response.getPayload());
                return;
            }

            const updateObject = {};

            if (this.req.body.name) {
                updateObject['name'] = this.req.body.name;
            }

            if (this.req.body.isbn) {
                updateObject['isbn'] = this.req.body.isbn;
            }

            if (this.req.body.country) {
                updateObject['country'] = this.req.body.country;
            }

            if (this.req.body.number_of_pages) {
                updateObject['number_of_pages'] = this.req.body.number_of_pages;
            }

            if (this.req.body.publisher) {
                updateObject['publisher'] = this.req.body.publisher;
            }

            if (this.req.body.release_date) {
                updateObject['release_date'] = this.req.body.release_date;
            }

            if (this.req.body.authors) {
                updateObject['authors'] = this.req.body.authors;
            }

            if (Object.keys(updateObject).length > 0) {
                const book = await Book.findOne({
                    where: {id: this.req.params.id},
                });
                if (book) {
                    let bookName = book.name;
                    await book.update(updateObject);

                    if (updateObject['authors']) {
                        await written_by.destroy({
                            where: {bookId: book.id}
                        });
                        for(const i in updateObject['authors'] )  {
                            var author = await Author.create({
                                name: updateObject['authors'][i],
                            });
                            await written_by.create({
                                authorId: author.id,
                                bookId: book.id,
                            });
                        }

                    }
                    const updatedBook = await this.getBookById(book.id);
                    const response =new SuccessResponse(200, updatedBook , `The Book ${bookName} was updated successfully`);
                    this.res.status(response.getStatus()).send(response.getPayload());
                } else {
                    const response = new ErrorResponse(422, `Book is missing`);
                    this.res.status(response.getStatus()).send(response.getPayload());
                }
            } else {
                const response = new ErrorResponse(422, `Parameters missing`);
                this.res.status(response.getStatus()).send(response.getPayload());
            }

        } catch (err) {
            console.log(err);
            const response =new ErrorResponse(500, `An error occurred while performing action - ${err}`);
            this.res.status(response.getStatus()).send(response.getPayload());
        }
    }

    async getBookById (id) {
        const newBook = await Book.findByPk(id, {
            include: [{model: Author}]
        });
        console.log(newBook);
        return {
            id: newBook.id,
            name: newBook.name,
            isbn: newBook.isbn,
            release_date: newBook.release_date,
            publisher: newBook.publisher,
            number_of_pages: newBook.number_of_pages,
            country: newBook.country,
            authors: newBook.Authors ? newBook.Authors.map(author => {
                return author.name;
            }) : [],
        }
    }

    async deleteBook(){
        if(!this.req.params.id) {
            const response =new ErrorResponse(422, `Missing Parameter id`);
            this.res.status(response.getStatus()).send(response.getPayload());
            return;
        }

        const book = await Book.findOne({
            where: {id: this.req.params.id},
        });
        if (book) {
            let bookName = book.name;
            await book.destroy({where: {id: book.id}});
            const response =new SuccessResponse(200, [] , `The Book ${bookName} was deleted successfully`);
            this.res.status(response.getStatus()).send(response.getPayload());
        } else {
            const response = new ErrorResponse(204, `Book does't exist.`);
            this.res.status(response.getStatus()).send(response.getPayload());
        }
    }

    async postNewBook() {
        try {

            const book = await Book.create({
                name: this.req.body.name,
                isbn:  this.req.body.isbn,
                number_of_pages:  this.req.body.number_of_pages,
                publisher:  this.req.body.publisher,
                country:  this.req.body.country,
                release_date: this.req.body.release_date,
            });

            const authors = this.req.body.authors;
            if(authors && (authors instanceof Array) && authors.length > 0) {
                for(const i in authors )  {
                    var author = await Author.create({
                        name: authors[i],
                    });
                    await written_by.create({
                        authorId: author.id,
                        bookId: book.id,
                    });
                }
            }

            const modifiedBook = await this.getBookById(book.id);
            const response =new SuccessResponse(201, modifiedBook);
            this.res.status(response.getStatus()).send(response.getPayload());

        } catch (err) {
            console.log(err);
            const response =new ErrorResponse(500, `An error occurred while performing action - ${err}`);
            this.res.status(response.getStatus()).send(response.getPayload());
        }
    }

}

module.exports = Books;
