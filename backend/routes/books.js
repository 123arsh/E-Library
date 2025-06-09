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
      cb(null, path.resolve('./public/books')); // 👈 Matches PDF folder
    } else {
      cb(new Error('Only image and PDF files are allowed!'));
    }
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage });

// ✅ POST route to add book
route.post('/addbook', upload.fields([
  { name: 'coverImg', maxCount: 1 },
  { name: 'bookPdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, author, description } = req.body;

    if (!title || !author || !req.files['coverImg'] || !req.files['bookPdf']) {
      return res.status(400).send({ message: 'Missing fields: title, author, coverImg, or bookPdf' });
    }

    const coverImg = `/booksImg/${req.files['coverImg'][0].filename}`;
    const bookPdf = `/books/${req.files['bookPdf'][0].filename}`;

    const book = await Book.create({
      title,
      author,
      coverImg,
      bookPdf,
      description,
      likes: 0,
      dislike: 0,
      comments: []
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

// ✅ GET all books
route.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (err) {
    res.status(500).send({ message: 'Failed to fetch books', error: err.message });
  }
});

// ✅ LIKE a book
route.post('/like/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    book.likes = (book.likes || 0) + 1;
    await book.save();

    res.status(200).json({ success: true, likes: book.likes });
  } catch (error) {
    res.status(500).json({ error: 'Failed to like book' });
  }
});

// ✅ DISLIKE a book
route.post('/dislike/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });

    book.dislike = (book.dislike || 0) + 1;
    await book.save();

    res.status(200).json({ success: true, dislike: book.dislike });
  } catch (error) {
    res.status(500).json({ error: 'Failed to dislike book' });
  }
});

// ✅ COMMENT on a book
route.post('/comment/:id', async (req, res) => {
  try {
    console.log('Received comment request body:', req.body); // Debug log
    const { text, user, timestamp } = req.body;
    
    // Validate comment text
    if (!text || typeof text !== 'string' || !text.trim()) {
      console.log('Invalid comment text:', text); // Debug log
      return res.status(400).json({ error: 'Valid comment text is required' });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      console.log('Book not found with ID:', req.params.id); // Debug log
      return res.status(404).json({ error: 'Book not found' });
    }

    // Filter out any malformed comments before saving
    book.comments = (book.comments || []).filter(
      c => c && typeof c === 'object' && typeof c.text === 'string' && c.text.trim()
    );

    // Create new comment object
    const newComment = {
      text: text.trim(),
      user: user || 'Anonymous',
      timestamp: new Date()
    };

    console.log('Creating new comment:', newComment); // Debug log

    // Add new comment at the beginning of the array
    book.comments.unshift(newComment);
    
    // Save the book and get the updated document
    const savedBook = await book.save();
    console.log('Book saved successfully with new comment'); // Debug log

    // Sort comments by timestamp (newest first)
    const sortedComments = savedBook.comments.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    console.log('Sending response with comments:', sortedComments); // Debug log

    res.status(200).json({ 
      success: true, 
      comments: sortedComments,
      message: 'Comment added successfully'
    });
  } catch (err) {
    console.error('Error in comment route:', err);
    res.status(500).json({ 
      error: 'Failed to post comment',
      details: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// ✅ GET comments for a book
route.get('/comments/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Sort comments by timestamp (newest first)
    const sortedComments = (book.comments || []).sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );

    res.status(200).json({ 
      success: true, 
      comments: sortedComments 
    });
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ 
      error: 'Failed to fetch comments',
      details: err.message 
    });
  }
});

// Search books by title, author, or genre (value)
route.get('/search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Missing search query' });

  const regex = new RegExp(q, 'i'); // case-insensitive
  try {
    const books = await Book.find({
      $or: [
        { title: regex },
        { author: regex },
        { value: regex }
      ]
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search books', details: err.message });
  }
});

module.exports = route;
