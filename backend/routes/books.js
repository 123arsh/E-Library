const express = require('express');
const multer = require('multer');
const path = require('path');
const route = express.Router(); // NOT express() here
const Book = require('../models/books');

// 1️⃣ Multer Storage Setup:
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, path.resolve('./public/uploads/Images'));
    } else if (file.mimetype === 'application/pdf') {
      cb(null, path.resolve('./public/uploads/PDFs'));
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


// 2️⃣ Route to Add Book:
route.post('/addbook', upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'bookPdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author } = req.body;
    if (!title || !req.files['coverImage'] || !req.files['bookPdf'] || !author) {
      return res.status(400).send({
        message: 'Title, Cover Image, Book PDF, or Author is missing!'
      });
    }

    const coverImg = `/uploads/Images/${req.files['coverImage'][0].filename}`;
    const bookPdf = `/uploads/PDFs/${req.files['bookPdf'][0].filename}`;

    const book = await Book.create({
      title,
      author,
      coverImg,
      bookPdf
    });

    return res.status(200).send({
      message: 'Book has been added successfully!',
      book
    });
  } catch (err) {
    return res.status(500).send({
      message: 'Failed to create Book!',
      error: err.message
    });
  }
});


// 3️⃣ Route to Fetch Books:
route.get('/book/books', async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json(books);
  } catch (err) {
    return res.status(500).send({
      message: 'Problem fetching books!',
      error: err.message
    });
  }
});


module.exports = route;
