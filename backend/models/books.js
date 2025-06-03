const { model, Schema } = require('mongoose');

const booksData = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  author: {
    type: String,
    required: true,
    index: true,
  },
  coverImg: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  bookPdf: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
    index: true,
  },
  value: {
    type: String,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislike: {
    type: Number,
    default: 0,
  },
  comments: {
    type: [
      {
        text: { type: String, required: true },
        user: { type: String, default: 'Anonymous' }, // can be replaced with ObjectId if you have users
        timestamp: { type: Date, default: Date.now }
      }
    ],
    default: []
  }
}, { timestamps: true });

const Book = model('Book', booksData);
module.exports = Book;
