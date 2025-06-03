const express = require('express');
const multer = require('multer');
const path = require('path');
const route = express.Router();
const Book = require('../models/books'); // Adjust path as needed

// ✅ Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, path.resolve('./public/booksImg'));
    } else if (file.mimetype === 'application/pdf') {
      cb(null, path.resolve('./public/books')); // 👈 Changed from booksPdf to books
    } else {
      cb(new Error('Only image and PDF files are allowed!'));
    }
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// ✅ POST route to add book
route.post('/addbook', upload.fields([
  { name: 'coverImg', maxCount: 1 },
  { name: 'bookPdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, description, like = 0, dislike = 0, comments = "" } = req.body;

    if (!title || !author || !req.files['coverImg'] || !req.files['bookPdf']) {
      return res.status(400).send({
        message: 'Title, Author, Cover Image, or Book PDF is missing!'
      });
    }

    const coverImg = `/booksImg/${req.files['coverImg'][0].filename}`;
    const bookPdf = `/books/${req.files['bookPdf'][0].filename}`; // 👈 Matches updated folder

    const book = await Book.create({
      title,
      author,
      coverImg,
      bookPdf,
      description,
      like,
      dislike,
      comments
    });

    return res.status(200).send({
      message: 'Book has been added successfully!',
      book
    });
  } catch (err) {
    return res.status(500).send({
      message: 'Failed to create book!',
      error: err.message
    });
  }
});

// ✅ GET route to fetch books
route.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).send({
      message: 'Failed to fetch books!',
      error: err.message
    });
  }
});

// POST /book/like/:id
route.post('/like/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    book.likes = Number(book.likes) + 1;
    await book.save();
    res.status(200).json({ success: true, likes: book.likes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like book' });
  }
});

// POST /book/dislike/:id
route.post('/dislike/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    book.dislike = Number(book.dislike) + 1;
    await book.save();
    res.status(200).json({ success: true, dislike: book.dislike });
  } catch (error) {
    res.status(500).json({ error: 'Failed to dislike book' });
  }
});

// POST /book/comment/:id
route.post('/comment/:id', async (req, res) => {
  try {
    const { text } = req.body;
    const book = await Book.findById(req.params.id);
    book.comments.push(text);
    await book.save();
    res.status(200).json({ success: true, comments: book.comments });
  } catch (err) {
    res.status(500).json({ error: 'Failed to post comment' });
  }
});


module.exports = route;
