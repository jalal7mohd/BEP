import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ token, setToken }) => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    author: '',
    genre: '',
    available: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/'); // Redirect to login page
      return;
    }

    fetchBooks();
  }, [token, navigate]);

  const fetchBooks = async (page = 1) => {
    setLoading(true);
    try {
      const sanitizedFilters = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key].trim() !== '') {
          sanitizedFilters[key] = filters[key];
        }
      });

      const response = await axios.get('http://localhost:5001/api/books/search', {
        headers: { 'x-auth-token': token },
        params: { ...sanitizedFilters, page },
      });
      setBooks(response.data.books || []);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
      });
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching books:', error.response?.data || error.message);
      setErrorMessage('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof setToken !== 'function') {
      console.error('setToken is not defined or not a function.');
      alert('An error occurred while logging out.');
      return;
    }

    localStorage.removeItem('token');
    setToken(null);
    alert('You have been logged out successfully.');
    navigate('/');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks();
  };

  return (
    <div>
      <NavBar handleLogout={handleLogout} />
      <header>
        <h1>Welcome to the Book Exchange</h1>
      </header>

      <div>
        <h2>Search for Books</h2>
        <form onSubmit={handleSearch}>
          <input type="text" name="title" placeholder="Title" value={filters.title} onChange={handleFilterChange} />
          <input type="text" name="author" placeholder="Author" value={filters.author} onChange={handleFilterChange} />
          <input type="text" name="genre" placeholder="Genre" value={filters.genre} onChange={handleFilterChange} />
          <select name="available" value={filters.available} onChange={handleFilterChange}>
            <option value="">Availability</option>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
          <button type="submit">Search</button>
          <button type="button" onClick={() => setFilters({ title: '', author: '', genre: '', available: '' })}>
            Clear Filters
          </button>
        </form>
      </div>

      <div>
        <h2>Available Books</h2>
        {loading ? (
          <p>Loading books...</p>
        ) : errorMessage ? (
          <p>{errorMessage}</p>
        ) : books.length > 0 ? (
          <ul>
            {books.map((book) => (
              <li key={book._id}>
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Genre: {book.genre}</p>
                <p>Condition: {book.condition}</p>
                <p>{book.available ? 'Available' : 'Not Available'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No books match your search criteria.</p>
        )}
      </div>

      <div>
        {pagination.totalPages > 1 && (
          <div>
            <button
              onClick={() => fetchBooks(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || loading}
            >
              Previous
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchBooks(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages || loading}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;