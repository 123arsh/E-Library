import React, { useEffect, useState } from 'react';
import { calculateRating } from '../utility/rating';

const AlertPopup = ({ closeAlert }) => (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-lg flex justify-center items-center z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative text-center">
      <button
        onClick={closeAlert}
        className="absolute top-2 right-2 text-red-600 text-xl font-bold hover:text-red-800"
      >
        &times;
      </button>
      <h2 className="text-2xl font-semibold mb-4 text-red-600">Please Login</h2>
      <p className="mb-6 text-gray-700">
        You haven't registered yourself. Redirecting to login in 3 seconds...
      </p>
      <button
        onClick={() => (window.location.href = '/login')}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Login / Register
      </button>
    </div>
  </div>
);

const List = () => {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [expandedBooks, setExpandedBooks] = useState({});
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    fetchUser();
    fetchBooks();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:9000/user');
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      setUser(data);
    } catch (err) {
      setUser(null);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch('http://localhost:9000/book/books');
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
    }
  };

  const handleLike = async (id) => {
    try {
      await fetch(`http://localhost:9000/book/like/${id}`, { method: 'POST' });
      const updatedBooks = books.map((book) =>
        book._id === id ? { ...book, likes: (parseInt(book.likes) || 0) + 1 } : book
      );
      setBooks(updatedBooks);
      if (selectedBook && selectedBook._id === id) {
        setSelectedBook(updatedBooks.find((book) => book._id === id));
      }
    } catch (err) {
      console.error('Like request failed:', err);
    }
  };

  const handleDislike = async (id) => {
    try {
      await fetch(`http://localhost:9000/book/dislike/${id}`, { method: 'POST' });
      const updatedBooks = books.map((book) =>
        book._id === id ? { ...book, dislike: (parseInt(book.dislike) || 0) + 1 } : book
      );
      setBooks(updatedBooks);
      if (selectedBook && selectedBook._id === id) {
        setSelectedBook(updatedBooks.find((book) => book._id === id));
      }
    } catch (err) {
      console.error('Dislike request failed:', err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;

    const newComment = {
      text: commentInput,
      user: user?.name || 'Anonymous',
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch(`http://localhost:9000/book/comment/${selectedBook._id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error('Failed to submit comment');

      const updatedComments = [...(selectedBook.comments || []), newComment];
      setSelectedBook({ ...selectedBook, comments: updatedComments });
      setBooks(
        books.map((book) =>
          book._id === selectedBook._id ? { ...book, comments: updatedComments } : book
        )
      );
      setCommentInput('');
    } catch (err) {
      console.error('Comment submission failed:', err);
    }
  };

  const handleViewClick = (book) => {
    if (user) {
      setSelectedBook(book);
    } else {
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        window.location.href = '/login';
      }, 3000);
    }
  };

  const toggleDescription = (id) => {
    setExpandedBooks((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col gap-6 p-4 text-white bg-[#121722]">
      {books.length === 0 && (
        <div className="text-center text-lg text-white">Loading or No Books Found</div>
      )}

      {books.map((e) => {
        const rating = calculateRating(e.likes, e.dislike);
        const isExpanded = expandedBooks[e._id];

        return (
          <div
            key={e._id}
            className="flex w-full h-[400px] border border-white rounded-2xl overflow-hidden shadow-md"
          >
            <img
              src={`http://localhost:9000${e.coverImg}`}
              alt={e.title}
              className="w-1/3 h-full object-cover"
            />
            <div className="p-6 flex flex-col justify-center gap-2 w-2/3">
              <h1 className="text-3xl font-bold mb-2">{e.title}</h1>
              <p className="text-xl italic mb-4 text-[#94A3B8]">by {e.author}</p>
              <p className="mb-4">
                {isExpanded ? e.description : `${e.description.slice(0, 120)}...`}
                <button className="text-blue-400 ml-2" onClick={() => toggleDescription(e._id)}>
                  {isExpanded ? 'Show less' : 'Read more'}
                </button>
              </p>
              <p>Rating: {rating} / 5 ⭐</p>
              <div className="flex gap-4">
                <p>Likes: {e.likes || 0}</p>
                <p>Dislikes: {e.dislike || 0}</p>
              </div>
              <button
                onClick={() => handleViewClick(e)}
                className="w-[150px] h-[45px] border border-gray-500 rounded-xl mt-2"
              >
                Know more
              </button>
            </div>
          </div>
        );
      })}

      {selectedBook && selectedBook.title && (
        <div className="w-full h-screen fixed inset-0 bg-black/40 backdrop-blur-lg z-50 flex justify-center items-center">
          <div className="bg-[#121722] p-8 h-[90vh] w-[80%] rounded-lg mx-auto relative border border-white overflow-y-auto">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center"
            >
              X
            </button>

            <div className="flex gap-6 h-full">
              <img
                src={`http://localhost:9000${selectedBook.coverImg || ''}`}
                alt={selectedBook.title}
                className="w-[280px] h-[360px] mt-10 object-cover rounded-md"
              />

              <div className="flex flex-col justify-start w-full mt-10">
                <h2 className="text-3xl font-bold mb-2">{selectedBook.title}</h2>
                <h4 className="text-xl text-[#94A3B8] italic mb-4">by {selectedBook.author}</h4>
                <p className="text-base mb-4">{selectedBook.description}</p>

                {selectedBook.pdf && (
                  <a
                    href={selectedBook.pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#193c8e] text-white rounded-md mt-2 inline-block"
                  >
                    Read PDF
                  </a>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    className="border border-white rounded-lg px-4 py-1"
                    onClick={() => handleLike(selectedBook._id)}
                  >
                    👍 Like
                  </button>

                  <button
                    className="border border-white rounded-lg px-4 py-1"
                    onClick={() => handleDislike(selectedBook._id)}
                  >
                    👎 Dislike
                  </button>
                </div>

                <div className="border border-white w-full flex flex-col gap-2 mt-6 p-3">
                  <label className="text-white">Comments</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Your Comment"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full h-[35px] pl-2 border border-white text-white bg-transparent"
                    />
                    <button
                      type="submit"
                      onClick={handleCommentSubmit}
                      className="w-[100px] h-[35px] border border-white text-white"
                    >
                      Submit
                    </button>
                  </div>
                  <div className="overflow-y-auto w-full max-h-[150px] mt-2">
                    {selectedBook.comments && selectedBook.comments.length > 0 ? (
                      selectedBook.comments.map((c, index) => (
                        <p key={index} className="text-sm border-b text-white border-white py-1">
                          {typeof c === 'object' ? (
                            <>
                              {c.text}{' '}
                              <span className="text-gray-400 italic">– {c.user}</span>
                            </>
                          ) : (
                            c
                          )}
                        </p>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">No comments yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAlert && <AlertPopup closeAlert={() => setShowAlert(false)} />}
    </div>
  );
};

export default List;
