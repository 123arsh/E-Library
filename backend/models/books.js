const { model, Schema } = require('mongoose');

const booksData = new Schema({
  title: {
    type: String,
    required: true,     // ✅ Corrected spelling
    unique: true,       // ✅ Corrected spelling
    index: true,
  },
  author: {
    type: String,
    required: true,     // ✅ Corrected spelling
    index: true,
  },
  coverImg: {
    type: String,
    required: true,     // ✅ Corrected spelling
    unique: true,       // ✅ Corrected spelling
    index: true,
  },
  bookPdf: {
    type: String,
    required: true,     // ✅ Corrected spelling
    unique: true,       // ✅ Corrected spelling
    index: true,
  },
  description: {
    type: String,
    required: true,     // ✅ Corrected spelling
    index: true,
  },
  likes: {
    type: String,
    default: 0
  },
  dislike: {
    type: String,
    default: 0
  },
  comments: {
    type: [String],     // ✅ Changed to an array to allow multiple comments
    default: []
  }
}, { timestamps: true });

const Book = model('Book', booksData);
module.exports = Book;
