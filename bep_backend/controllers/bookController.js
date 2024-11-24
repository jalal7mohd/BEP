const Book = require('../models/Book');

// Add Book
const addBook = async (req, res) => {
  const { title, author, genre, condition, available } = req.body;

  if (!title || !author || !genre || !condition || !available) {
    return res.status(400).json({ message: 'Please provide all book details' });
  }

  try {
    const book = new Book({
      title,
      author,
      genre,
      condition,
      available,
      userId: req.user.id,
    });

    await book.save();
    res.status(201).json({ message: 'Book added successfully', book });
  } catch (error) {
    console.error('Error adding book:', error);
    res.status(500).json({ message: 'Failed to add book' });
  }
};

const getUserBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user.id });
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books.' });
  }
};

//Edit book
const editBook = async (req, res) => {
  try {
    console.log('Book ID:', req.params.id); // Log the book ID from the request
    console.log('Request Body:', req.body); // Log the request body
    console.log('User ID:', req.user.id);

    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found.' });
    if (book.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized.' });

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    console.log('Updated Book:', updatedBook);
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update book.' });
  }
};

// Delete  book
const deleteBook = async (req, res) => {
  try {
    console.log('Delete request received.');
    console.log('Book ID:', req.params.id);
    console.log('User ID:', req.user.id);

    const book = await Book.findById(req.params.id);
    if (!book) {
      console.error('Book not found.');
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (book.userId.toString() !== req.user.id) {
      console.error('Unauthorized deletion attempt.');
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    await book.deleteOne();
    console.log('Book deleted successfully.');
    res.status(200).json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error('Error during book deletion:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get all books (for search)
const getAllBooks = async (req, res) => {
  const { title, author, genre, available, location, page = 1, limit = 10 } = req.query;

  try {
    const query = {};

    // Add filters 
    if (title) query.title = { $regex: title, $options: 'i' }; // Case-insensitive partial match
    if (author) query.author = { $regex: author, $options: 'i' };
    if (genre) query.genre = { $regex: genre, $options: 'i' };
    if (available !== undefined) query.available = available === 'true';
    if (location) query.location = { $regex: location, $options: 'i' };

    console.log('Constructed query:', query);

    
    const skip = (page - 1) * limit;


    const books = await Book.find(query).skip(skip).limit(parseInt(limit));
    const totalBooks = await Book.countDocuments(query);

    res.status(200).json({
      books,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error searching books:', error.message);
    res.status(500).json({ message: 'Failed to search books.' });
  }
};

module.exports = { addBook, getUserBooks, editBook, deleteBook, getAllBooks };

