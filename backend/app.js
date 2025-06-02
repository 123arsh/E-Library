require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000; // ✅ Default fallback
const cors = require('cors');
const path = require('path');
const { connectMongoDB } = require('./connection');
const userRoutes = require('./routes/routes');
const booksData = require('./routes/books');

/* Middlewares */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

/* Static Files (e.g. images, PDFs) */
app.use('/booksImg', express.static(path.join(__dirname, 'public/booksImg')));
app.use('/books', express.static(path.join(__dirname, 'public/books')));

/* API Routes */
app.use('/', userRoutes);
app.use('/book', booksData);

/* Database Connection */
connectMongoDB(process.env.Mongo_DB)
  .then(() => console.log('✅ Database connected...'))
  .catch((err) => console.error('❌ Database connection failed:', err.message));

/* Server */
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
