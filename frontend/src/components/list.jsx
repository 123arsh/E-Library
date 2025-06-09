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
  const [likeAnim, setLikeAnim] = useState({});
  const [dislikeAnim, setDislikeAnim] = useState({});
  const [userBookLikes, setUserBookLikes] = useState({});

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
    if (!user || userBookLikes[id] === 'like') return;
    await fetch(`http://localhost:9000/book/like/${id}`, { method: 'POST' });
    const updatedBooks = books.map((book) =>
      book._id === id ? { ...book, likes: (parseInt(book.likes) || 0) + 1 } : book
    );
    setBooks(updatedBooks);
    if (selectedBook && selectedBook._id === id) {
      setSelectedBook(updatedBooks.find((book) => book._id === id));
    }
    setUserBookLikes((prev) => ({ ...prev, [id]: 'like' }));
    setLikeAnim((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setLikeAnim((prev) => ({ ...prev, [id]: false })), 400);
  };

  const handleDislike = async (id) => {
    if (!user || userBookLikes[id] === 'dislike') return;
    await fetch(`http://localhost:9000/book/dislike/${id}`, { method: 'POST' });
    const updatedBooks = books.map((book) =>
      book._id === id ? { ...book, dislike: (parseInt(book.dislike) || 0) + 1 } : book
    );
    setBooks(updatedBooks);
    if (selectedBook && selectedBook._id === id) {
      setSelectedBook(updatedBooks.find((book) => book._id === id));
    }
    setUserBookLikes((prev) => ({ ...prev, [id]: 'dislike' }));
    setDislikeAnim((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setDislikeAnim((prev) => ({ ...prev, [id]: false })), 400);
  };

  const handleCommentSubmit = async () => {
    if (!commentInput.trim()) return;

    const newComment = {
      text: commentInput.trim(),
      user: user?.name || 'Anonymous',
      timestamp: new Date()
    };

    try {
      console.log('Submitting comment:', newComment); // Debug log
      
      if (!selectedBook?._id) {
        throw new Error('No book selected');
      }

      const res = await fetch(`http://localhost:9000/book/comment/${selectedBook._id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newComment),
      });

      const data = await res.json();
      console.log('Server response:', data); // Debug log

      if (!res.ok) {
        throw new Error(data.error || data.message || 'Failed to submit comment');
      }

      if (data.success) {
        // Update both the selected book and the books list with the new comments
        const updatedComments = data.comments;
        setSelectedBook(prev => ({
          ...prev,
          comments: updatedComments
        }));
        
        setBooks(prevBooks => 
          prevBooks.map(book => 
            book._id === selectedBook._id 
              ? { ...book, comments: updatedComments }
              : book
          )
        );
        
        setCommentInput('');
      } else {
        throw new Error(data.error || 'Failed to submit comment');
      }
    } catch (err) {
      console.error('Comment submission failed:', err);
      alert(`Failed to submit comment: ${err.message}`);
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

  // Add a new function for rating calculation based on likes, dislikes, and comments
  const calculateBookRating = (likes, dislikes, comments) => {
    const total = (likes || 0) + (dislikes || 0) + (comments || 0);
    if (total === 0) return null;
    return ((likes / total) * 5).toFixed(1);
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
              <p className='text-white'>Rating: {rating} / 5 ⭐</p>
              <div className="flex gap-4">
                <span>👍 {e.likes || 0}</span>
                <span>👎 {e.dislike || 0}</span>
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
          <div className="bg-[#121722] p-8 h-[90vh] w-[80%] rounded-lg mx-auto relative border border-white ">
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

                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-yellow-400 text-2xl">⭐</span>
                    <span className="text-lg font-bold">
                      {(() => {
                        const rating = calculateBookRating(selectedBook.likes, selectedBook.dislike, selectedBook.comments?.length || 0);
                        return rating ? `${rating} / 5` : 'No rating yet';
                      })()}
                    </span>
                    <span className="ml-2 text-gray-400 text-sm">({selectedBook.likes || 0} likes, {selectedBook.dislike || 0} dislikes, {selectedBook.comments?.length || 0} comments)</span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className={`relative flex items-center gap-2 px-5 py-2 rounded-full border border-transparent font-semibold transition-transform duration-200 focus:outline-none shadow-sm
                        ${likeAnim[selectedBook._id] ? 'scale-110' : ''}
                        ${userBookLikes[selectedBook._id] === 'like' ? 'bg-green-500 text-white' : 'bg-gray-800 text-green-600 hover:bg-green-100 hover:text-green-700'}
                        ${userBookLikes[selectedBook._id] === 'like' ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                      onClick={() => handleLike(selectedBook._id)}
                      disabled={!user || userBookLikes[selectedBook._id] === 'like'}
                      title={userBookLikes[selectedBook._id] === 'like' ? 'You liked this!' : 'Like this book'}
                    >
                      <span className="font-bold">Like</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm font-bold">{selectedBook.likes || 0}</span>
                    </button>
                    <button
                      className={`relative flex items-center gap-2 px-5 py-2 rounded-full border border-transparent font-semibold transition-transform duration-200 focus:outline-none shadow-sm
                        ${dislikeAnim[selectedBook._id] ? 'scale-110' : ''}
                        ${userBookLikes[selectedBook._id] === 'dislike' ? 'bg-red-600 text-white' : 'bg-gray-800 text-red-500 hover:bg-red-100 hover:text-red-700'}
                        ${userBookLikes[selectedBook._id] === 'dislike' ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                      onClick={() => handleDislike(selectedBook._id)}
                      disabled={!user || userBookLikes[selectedBook._id] === 'dislike'}
                      title={userBookLikes[selectedBook._id] === 'dislike' ? 'You disliked this!' : 'Dislike this book'}
                    >
                      <span className="font-bold">Dislike</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm font-bold">{selectedBook.dislike || 0}</span>
                    </button>
                  </div>
                </div>

                <div className="border border-white w-full flex flex-col gap-2 mt-6 p-4 rounded-lg bg-gray-900/50 overflow-y-auto">
                  <h3 className="text-xl font-semibold text-white mb-2">Comments</h3>
                  {!user ? (
                    <div className="mb-4 text-yellow-400 bg-yellow-900/30 p-3 rounded">
                      Please <a href="/login" className="underline text-blue-400">log in</a> to post a comment.
                    </div>
                  ) : null}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder={!user ? "Log in to comment" : "Share your thoughts..."}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full h-[40px] pl-3 pr-3 rounded-md border border-gray-600 text-white bg-gray-800/50 focus:outline-none focus:border-blue-500 transition-colors"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && user) {
                          handleCommentSubmit();
                        }
                      }}
                      disabled={!user}
                    />
                    <button
                      type="submit"
                      onClick={handleCommentSubmit}
                      disabled={!user || !commentInput.trim()}
                      className={`px-4 h-[40px] rounded-md border transition-colors ${
                        user && commentInput.trim()
                          ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                          : 'bg-gray-700 text-gray-400 border-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Post
                    </button>
                  </div>
                  <div className="overflow-y-auto w-full max-h-[300px] mt-2 space-y-3">
                    {selectedBook.comments && selectedBook.comments.length > 0 ? (
                      selectedBook.comments.map((comment, index) => (
                        <div key={index} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                                {comment.user?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <p className="text-white font-medium">{comment.user || 'Anonymous'}</p>
                                <p className="text-gray-400 text-xs">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-200 mt-2 ml-10 break-words">{comment.text}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <p className="text-lg">No comments yet</p>
                        <p className="text-sm mt-1">Be the first to share your thoughts!</p>
                      </div>
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
