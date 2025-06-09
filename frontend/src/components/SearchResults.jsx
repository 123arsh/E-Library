import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';

const SearchResults = () => {
  const [user, setUser] = useState();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState({}); // { [bookId]: number }
  const [dislikes, setDislikes] = useState({}); // { [bookId]: number }
  const [userBookLikes, setUserBookLikes] = useState({}); // { [bookId]: 'like' | 'dislike' }
  const [comments, setComments] = useState({}); // { [bookId]: [ { text, user, timestamp } ] }
  const [commentInput, setCommentInput] = useState('');
  const [modalBook, setModalBook] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query')?.toLowerCase() || '';

  useEffect(()=>{
      fetch('http://localhost:9000/user')
      .then((res)=>{ 
        console.log('Data has been succesfully fetched...');
        return res.json(res)
       })
       .then((data)=>{
        return setUser(data)
       })
       .catch(()=>{
        console.log('Problem with fetching data from the Server...')
       })
    }, [])

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:9000/book/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setBooks(data);
        // Initialize likes/dislikes/comments for new books
        const newLikes = {};
        const newDislikes = {};
        const newComments = {};
        data.forEach(book => {
          newLikes[book._id || book.id] = book.likes || 0;
          newDislikes[book._id || book.id] = book.dislike || 0;
          newComments[book._id || book.id] = [];
        });
        setLikes(newLikes);
        setDislikes(newDislikes);
        setComments(newComments);
        setLoading(false);
      })
      .catch(() => {
        setBooks([]);
        setLoading(false);
      });
  }, [query]);

  const handleLike = (bookId) => {
    if (!user || userBookLikes[bookId] === 'like') return;
    setLikes(prev => ({ ...prev, [bookId]: (prev[bookId] || 0) + 1 }));
    setUserBookLikes(prev => ({ ...prev, [bookId]: 'like' }));
  };
  const handleDislike = (bookId) => {
    if (!user || userBookLikes[bookId] === 'dislike') return;
    setDislikes(prev => ({ ...prev, [bookId]: (prev[bookId] || 0) + 1 }));
    setUserBookLikes(prev => ({ ...prev, [bookId]: 'dislike' }));
  };
  const calculateBookRating = (bookId) => {
    const l = likes[bookId] || 0;
    const d = dislikes[bookId] || 0;
    const c = comments[bookId]?.length || 0;
    const total = l + d + c;
    if (total === 0) return null;
    return ((l / total) * 5).toFixed(1);
  };
  const handleCommentSubmit = (bookId) => {
    if (!commentInput.trim() || !user) return;
    const newComment = {
      text: commentInput.trim(),
      user: user?.name || 'Anonymous',
      timestamp: new Date()
    };
    setComments(prev => ({
      ...prev,
      [bookId]: [newComment, ...(prev[bookId] || [])]
    }));
    setCommentInput('');
  };

  // Add helper for genre icon
  const genreIcon = (genre) => {
    switch ((genre || '').toLowerCase()) {
      case 'motivational': return '💡';
      case 'spiritual': return '🕉️';
      case 'romantic': return '💖';
      case 'action': return '⚔️';
      default: return '📚';
    }
  };

  return (
    <div className="p-10 text-white bg-[#080d13] min-h-screen">
      <h1 className="text-2xl mb-4">Search Results for: <span className="text-blue-400">{query}</span></h1>
      {loading ? (
        <div className="text-lg text-gray-400">Loading...</div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-4 gap-4 ">
          {books.map(book => (
            <div
              key={book._id || book.id}
              className="bg-white/10 backdrop-blur-md p-4 text-white rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col items-center min-h-[350px] min-w-[400px] border border-white/10 relative overflow-hidden group"
              style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)' }}
            >
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/10 rounded-full blur-2xl z-0" />
              <img src={`http://localhost:9000${book.coverImg}`} alt={book.title} className="w-40 h-56 object-cover rounded-lg shadow-md mb-3 border-2 border-[#22304a] z-10" />
              <h2 className="text-2xl font-bold mt-2 text-center line-clamp-2 font-serif z-10">{book.title}</h2>
              <p className="text-blue-300 font-medium text-center mb-1 z-10">{book.author}</p>
              <span className="inline-flex items-center gap-1 bg-blue-900/60 text-blue-200 text-xs px-3 py-1 rounded-full mb-2 mt-1 shadow genre-badge z-10 animate-bounce">
                <span>{genreIcon(book.value)}</span> {book.value}
              </span>
              <button
                className="mt-6 px-10 py-3 bg-[#181f2a] text-white text-lg font-bold shadow-lg z-10 tracking-wide border-1 border-transparent relative view-btn-gradient rounded-md"
                onClick={() => setModalBook(book)}
                style={{
                  backgroundClip: 'padding-box',
                  borderImage: 'linear-gradient(90deg, #2563eb, #a21caf) 1',
                }}
              >
                View
              </button>
              <style>{`
                .view-btn-gradient {
                  border-image: linear-gradient(90deg, #2563eb, #a21caf) 1;
                }
                .ripple {
                  position: absolute;
                  border-radius: 50%;
                  transform: scale(0);
                  animation: ripple 0.6s linear;
                  background: rgba(255,255,255,0.5);
                  pointer-events: none;
                  width: 100px;
                  height: 100px;
                  left: 50%;
                  top: 50%;
                  margin-left: -50px;
                  margin-top: -50px;
                  z-index: 20;
                }
                @keyframes ripple {
                  to {
                    transform: scale(2.5);
                    opacity: 0;
                  }
                }
                .genre-badge { animation-delay: 0.2s; }
              `}</style>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-lg text-gray-400 flex flex-col items-center mt-10">
          <img src="/no-results.svg" alt="No results" className="w-32 h-32 mb-4 opacity-60" />
          <span>No books found. Try a different search!</span>
        </div>
      )}
      {/* Modal for book details and comments */}
      {modalBook && (
        <div className="fixed inset-0 z-50 flex justify-center items-center" style={{ backdropFilter: 'blur(8px)' }}>
          <div className="bg-[#181f2a] p-8 rounded-2xl shadow-2xl h-[90%] w-[80%] relative border border-white/20 flex flex-row gap-10 items-start">
            <button
              onClick={() => setModalBook(null)}
              className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold"
            >
              ×
            </button>
            {/* Left: Book Cover */}
            <div className="flex-shrink-0 flex flex-col items-center w-[320px]">
              <img src={`http://localhost:9000${modalBook.coverImg}`} alt={modalBook.title} className="w-72 h-96 object-cover rounded-xl shadow-lg border-2 border-[#22304a] bg-white" />
            </div>
            {/* Right: Content */}
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              <h2 className="text-4xl font-extrabold text-white mb-1 leading-tight">{modalBook.title}</h2>
              <p className="italic text-xl text-[#94A3B8] mb-2">by {modalBook.author}</p>
              <p className="text-base text-gray-200 mb-2">{modalBook.description}</p>
              <a
                href={modalBook.pdf}
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold mb-2 transition-colors duration-200 shadow"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read PDF
              </a>
              <div className="flex items-center gap-3 mb-2 mt-2">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="font-bold text-lg text-white">
                  {calculateBookRating(modalBook._id || modalBook.id) ? `${calculateBookRating(modalBook._id || modalBook.id)}` : 'No rating yet'}
                </span>
                <span className="text-gray-400 text-base">(
                  {likes[modalBook._id || modalBook.id] || 0} likes, {dislikes[modalBook._id || modalBook.id] || 0} dislikes, {comments[modalBook._id || modalBook.id]?.length || 0} comments
                )</span>
              </div>
              <div className="flex gap-4 mb-4">
                <button
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-lg transition-all duration-200 focus:outline-none shadow-sm
                    ${userBookLikes[modalBook._id || modalBook.id] === 'like' ? 'bg-green-700 text-white' : 'bg-[#232b3a] text-green-400 hover:bg-green-900'}
                    ${userBookLikes[modalBook._id || modalBook.id] === 'like' ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                  onClick={() => handleLike(modalBook._id || modalBook.id)}
                  disabled={!user || userBookLikes[modalBook._id || modalBook.id] === 'like'}
                >
                  Like <span className="ml-1 text-base font-bold">{likes[modalBook._id || modalBook.id] || 0}</span>
                </button>
                <button
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-lg transition-all duration-200 focus:outline-none shadow-sm
                    ${userBookLikes[modalBook._id || modalBook.id] === 'dislike' ? 'bg-red-700 text-white' : 'bg-[#232b3a] text-red-400 hover:bg-red-900'}
                    ${userBookLikes[modalBook._id || modalBook.id] === 'dislike' ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                  onClick={() => handleDislike(modalBook._id || modalBook.id)}
                  disabled={!user || userBookLikes[modalBook._id || modalBook.id] === 'dislike'}
                >
                  Dislike <span className="ml-1 text-base font-bold">{dislikes[modalBook._id || modalBook.id] || 0}</span>
                </button>
              </div>
              <div className="flex flex-col flex-1 justify-end">
                <div className="bg-[#10141b] border border-gray-600 rounded-xl p-4 mt-2 flex flex-col gap-2 shadow-inner h-[320px] max-h-[320px] min-h-[220px]">
                  <h3 className="text-xl font-semibold mb-2 text-white">Comments</h3>
                  {!user ? (
                    <div className="mb-4 text-yellow-400 bg-yellow-900/30 p-3 rounded">
                      Please <Link to="/login" className="underline text-blue-400">log in</Link> to post a comment.
                    </div>
                  ) : null}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      placeholder={!user ? "Log in to comment" : "Share your thoughts..."}
                      value={commentInput}
                      onChange={e => setCommentInput(e.target.value)}
                      className="w-full h-[40px] pl-3 pr-3 rounded-md border border-gray-600 text-white bg-gray-800/50 focus:outline-none focus:border-blue-500 transition-colors"
                      onKeyPress={e => {
                        if (e.key === 'Enter' && user) {
                          handleCommentSubmit(modalBook._id || modalBook.id);
                        }
                      }}
                      disabled={!user}
                    />
                    <button
                      type="submit"
                      onClick={() => handleCommentSubmit(modalBook._id || modalBook.id)}
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
                  <div className="overflow-y-auto w-full flex-1 space-y-3 pr-2">
                    {comments[modalBook._id || modalBook.id] && comments[modalBook._id || modalBook.id].length > 0 ? (
                      comments[modalBook._id || modalBook.id].map((comment, index) => {
                        const isNew = Date.now() - new Date(comment.timestamp).getTime() < 5 * 60 * 1000;
                        return (
                          <div key={index} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                              {comment.user?.charAt(0)?.toUpperCase() || '?'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="text-white font-medium">{comment.user || 'Anonymous'}</p>
                                <p className="text-gray-400 text-xs">
                                  {new Date(comment.timestamp).toLocaleString()}
                                </p>
                                {isNew && <span className="ml-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">New</span>}
                              </div>
                              <p className="text-gray-200 mt-1 break-words">{comment.text}</p>
                            </div>
                          </div>
                        );
                      })
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
    </div>
  );
};

export default SearchResults;
