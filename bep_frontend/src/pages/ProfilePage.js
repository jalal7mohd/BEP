import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { useNavigate } from 'react-router-dom';

const ProfilePage = ({ token, handleLogout }) => {
  const [user, setUser] = useState(null);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '', genre: '', condition: '', available: true });
  const [editingBook, setEditingBook] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // user profile and user's books
  useEffect(() => {
    if (!token) {
      navigate('/'); // Redirect to login 
      return;
    }

    //user profile
    setLoading(true);
    axios
      .get('http://localhost:5001/api/users/profile', {
        headers: { 'x-auth-token': token },
      })
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        setErrorMessage(
          error.response?.data?.message || 'Failed to load profile. Please try again.'
        );
        setLoading(false);
      });

    // Get user's books
    axios
      .get('http://localhost:5001/api/books/user', {
        headers: { 'x-auth-token': token },
      })
      .then((response) => {
        setBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, [token, navigate]);

  // password reset
  const handlePasswordReset = async () => {
    if (!currentPassword || !newPassword) {
      setMessage('Please provide both current and new passwords.');
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:5001/api/users/reset-password',
        { currentPassword, newPassword },
        { headers: { 'x-auth-token': token } }
      );

      setMessage(response.data.message); 
      setCurrentPassword(''); // Clear input fields
      setNewPassword('');
    } catch (error) {
      console.error('Error resetting password:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Failed to reset password.');
    }
  };

  // add or edit book
  const handleAddOrEditBook = async () => {
    try {
      setLoading(true);
      if (editingBook) {
        const response = await axios.put(`http://localhost:5001/api/books/${editingBook._id}`, form, {
          headers: { 'x-auth-token': token },
        });
        setBooks(books.map((book) => (book._id === editingBook._id ? response.data : book)));
        setMessage('Book updated successfully!');
      } else {
        const response = await axios.post('http://localhost:5001/api/books', form, {
          headers: { 'x-auth-token': token },
        });
        setBooks([...books, response.data]);
        setMessage('Book added successfully!');
      }
      setForm({ title: '', author: '', genre: '', condition: '', available: true });
      setEditingBook(null);
      setLoading(false);
    } catch (error) {
      console.error('Error saving book:', error);
      setMessage('Failed to save book.');
      setLoading(false);
    }
  };

  // delete book
const handleDeleteBook = async (id) => {
  const confirmed = window.confirm('Are you sure you want to delete this book?');
  if (!confirmed) return;

  try {
    console.log('Attempting to delete book with ID:', id);
    setLoading(true);

    // DELETE request 
    const response = await axios.delete(`http://localhost:5001/api/books/${id}`, {
      headers: { 'x-auth-token': token },
    });

    console.log('Backend response:', response.data);

    const updatedBooks = books.filter((book) => book._id !== id);
    setBooks(updatedBooks);
    console.log('Updated books list:', updatedBooks);

    setMessage('Book deleted successfully!');
  } catch (error) {
    console.error('Error deleting book:', error.response?.data || error.message);
    setMessage(error.response?.data?.message || 'Failed to delete book.');
  } finally {
    setLoading(false);
  }
};

  if (!user || loading) {
    return <div>{loading ? 'Loading...' : errorMessage || 'Loading profile...'}</div>;
  }

  return (
    <div>
      <NavBar handleLogout={handleLogout} />
      <h1>Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>

      <h2>Your Book Listings</h2>
      <div>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="Genre"
          value={form.genre}
          onChange={(e) => setForm({ ...form, genre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Condition"
          value={form.condition}
          onChange={(e) => setForm({ ...form, condition: e.target.value })}
        />
        <label>
          Available:
          <input
            type="checkbox"
            checked={form.available}
            onChange={(e) => setForm({ ...form, available: e.target.checked })}
          />
        </label>
        <button onClick={handleAddOrEditBook} disabled={loading}>
          {editingBook ? 'Update Book' : 'Add Book'}
        </button>
      </div>

      <ul>
        {books.map((book) => (
          <li key={book._id}>
            <h3>{book.title}</h3>
            <p>Author: {book.author}</p>
            <p>Genre: {book.genre}</p>
            <p>Condition: {book.condition}</p>
            <p>{book.available ? 'Available' : 'Not Available'}</p>
            <button onClick={() => setEditingBook(book)} disabled={loading}>Edit</button>
            <button onClick={() => handleDeleteBook(book._id)} disabled={loading}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Reset Password</h2>
      <div>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <button onClick={handlePasswordReset} disabled={loading}>Reset Password</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ProfilePage;
