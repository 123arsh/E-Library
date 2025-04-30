const { model, Schema } = require('mongoose');
const booksData = new Schema({
    title: {
        type: String,
        require: true,
        uniue: true,
        index: true,
    },
    author:{
        type: String,
        require: true,
        index: true
    },
    coverImg: {
        type: String,
        require: true,
        uniue: true,
        index: true,
    },
    bookPdf: {
        type: String,
        require: true,
        uniue: true,
        index: true,
    },
    description: {
        type: String,
        require: true,
        index: true,
    }
}, { timestamps: true })

const Book = model('Book', booksData);
module.exports = Book;