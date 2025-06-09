require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000; // Changed to match frontend
const cors = require('cors');
const path = require('path');
const { connectMongoDB } = require('./connection');
const userRoutes = require('./routes/routes');
const booksData = require('./routes/books');

/* Middlewares */
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* Static Files (e.g. images, PDFs) */
app.use('/booksImg', express.static(path.join(__dirname, 'public/booksImg')));
app.use('/books', express.static(path.join(__dirname, 'public/books')));

/* API Routes */
app.use('/', userRoutes);
app.use('/book', booksData);

/* Error handling middleware */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

/* Database Connection */
connectMongoDB(process.env.Mongo_DB)
  .then(() => console.log('✅ Database connected...'))
  .catch((err) => console.error('❌ Database connection failed:', err.message));

/* Server */
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
