const express = require('express');
const { addBook, getUserBooks, editBook, deleteBook, getAllBooks } = require('../controllers/bookController');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

// Routes
router.post('/', verifyToken, addBook); // Add book
router.get('/user', verifyToken, getUserBooks); // Get user's books
router.put('/:id', verifyToken, editBook); // Edit book
router.delete('/:id', verifyToken, deleteBook); // Delete book
router.get('/search', getAllBooks); // Get all books

module.exports = router;
