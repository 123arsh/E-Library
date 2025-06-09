import React, { useState, useEffect } from 'react';

const booksData = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    coverImg: '/booksImg/atomic-habits.jpg',
    pdf: '/books/Atomic_Habits.pdf',
    like: true,
    description: 'In Atomic Habits, James Clear emphasizes that tiny changes lead to remarkable results over time — success is simply the product of daily small improvements...'
  },
  {
    id: 2,
    title: 'Master Your Emotions',
    author: 'Thibaut Meurisse',
    coverImg: '/booksImg/master-your-emotions.jpg',
    value: 'motivational',
    pdf: '/books/Master_Your_Emotions_A_Practical_Guide_to_Overcome.pdf',
    description: 'In Master Your Emotions, Thibaut Meurisse explains how emotions influence our thoughts, actions, and overall quality of life...'
  },
  {
    id: 3,
    title: 'Self Discipline Mindset',
    author: 'Curtis Leone',
    coverImg: '/booksImg/sellf-discipline-mindset.jpg',
    value: 'motivational',
    pdf: '/books/sdms.pdf',
    description: 'In Self-Discipline Mindset, Curtis Leone explores how mastering discipline is the true foundation for achieving any form of success...'
  },
  {
    id: 4,
    title: 'The Monk Who Sold His Ferrari',
    author: 'Robin Sharma',
    coverImg: '/booksImg/mshf.jpg',
    value: 'motivational',
    pdf: '/books/The_Monk_Who_Sold_His_Ferrari.pdf',
    description: 'In The Monk Who Sold His Ferrari, Robin Sharma tells the inspiring story of Julian Mantle...'
  },
  {
    id: 5,
    title: 'The Subtle Art of Not Giving a F*ck',
    author: 'Mark Manson',
    coverImg: '/booksImg/saongf.jpg',
    value: 'motivational',
    pdf: '/books/The_Subtle_Art_of_Not_Giving_Fck.pdf',
    description: 'In The Subtle Art of Not Giving a F*ck, Mark Manson challenges the traditional self-help advice of always striving for positivity...'
  }
  // ... add other books here as you had before
];

const AlertPopup = ({ closeAlert }) => {
  return (
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
          You haven't registered yourself. Please register or login first.
        </p>
        <button
          onClick={() => window.location.href = '/login'}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Login / Register
        </button>
      </div>
    </div>
  );
};

const FeturedSection = () => {
  const [selectedBook, setSelectedBook] = useState(null);
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState({}); // { [bookId]: [ { text, user, timestamp, likes, dislikes, userAction } ] }
  const [commentLikes, setCommentLikes] = useState({}); // { [commentKey]: 'like' | 'dislike' | null }
  const [bookLikes, setBookLikes] = useState({}); // { [bookId]: 'like' | 'dislike' }
  const [booksDataState, setBooksDataState] = useState(booksData.map(book => ({ ...book, likes: 0, dislikes: 0 })));
  const [likeAnim, setLikeAnim] = useState({}); // { [bookId]: true/false }
  const [dislikeAnim, setDislikeAnim] = useState({}); // { [bookId]: true/false }

  useEffect(() => {
    fetch('http://localhost:9000/user')
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
        setUser(null); // treat error as no user
      });
  }, []);

  const handleViewClick = (book) => {
    const latestBook = booksDataState.find(b => b.id === book.id);
    if (user) {
      setSelectedBook(latestBook);
    } else {
      setShowAlert(true);
    }
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const closeAlert = () => {
    setShowAlert(false);
  };

  const handleCommentSubmit = () => {
    if (!commentInput.trim() || !selectedBook || !user) return;
    const newComment = {
      text: commentInput.trim(),
      user: user?.name || 'Anonymous',
      timestamp: new Date(),
      likes: 0,
      dislikes: 0
    };
    setComments(prev => ({
      ...prev,
      [selectedBook.id]: [newComment, ...(prev[selectedBook.id] || [])]
    }));
    setCommentInput('');
  };

  const handleLikeDislike = (bookId, index, action) => {
    const commentKey = `${bookId}_${index}`;
    setComments(prev => {
      const bookComments = prev[bookId] ? [...prev[bookId]] : [];
      if (!bookComments[index]) return prev;
      // Prevent double-like/dislike
      const prevAction = commentLikes[commentKey];
      if (prevAction === action) return prev;
      if (action === 'like') {
        bookComments[index].likes = (bookComments[index].likes || 0) + 1;
        if (prevAction === 'dislike') {
          bookComments[index].dislikes = Math.max((bookComments[index].dislikes || 1) - 1, 0);
        }
      } else if (action === 'dislike') {
        bookComments[index].dislikes = (bookComments[index].dislikes || 0) + 1;
        if (prevAction === 'like') {
          bookComments[index].likes = Math.max((bookComments[index].likes || 1) - 1, 0);
        }
      }
      return {
        ...prev,
        [bookId]: bookComments
      };
    });
    setCommentLikes(prev => ({ ...prev, [commentKey]: action }));
  };

  const handleBookLike = (bookId, action) => {
    if (!user || bookLikes[bookId] === action) return;
    setBooksDataState(prev => {
      const updated = prev.map(book => {
        if (book.id !== bookId) return book;
        if (action === 'like') {
          return { ...book, likes: (book.likes || 0) + 1 };
        } else if (action === 'dislike') {
          return { ...book, dislikes: (book.dislikes || 0) + 1 };
        }
        return book;
      });
      // Also update selectedBook if open
      if (selectedBook && selectedBook.id === bookId) {
        const updatedBook = updated.find(b => b.id === bookId);
        setSelectedBook(updatedBook);
      }
      return updated;
    });
    setBookLikes(prev => ({ ...prev, [bookId]: action }));
    if (action === 'like') {
      setLikeAnim(prev => ({ ...prev, [bookId]: true }));
      setTimeout(() => setLikeAnim(prev => ({ ...prev, [bookId]: false })), 400);
    } else if (action === 'dislike') {
      setDislikeAnim(prev => ({ ...prev, [bookId]: true }));
      setTimeout(() => setDislikeAnim(prev => ({ ...prev, [bookId]: false })), 400);
    }
  };

  // Add a new function for rating calculation based on likes, dislikes, and comments
  const calculateBookRating = (likes, dislikes, comments) => {
    const total = (likes || 0) + (dislikes || 0) + (comments || 0);
    if (total === 0) return null;
    return ((likes / total) * 5).toFixed(1);
  };

  return (
    <div className="relative flex flex-col justify-center mt-[50px] gap-6 p-6 bg-[#080d13] border border-[#94A3B8] rounded-4xl">
      <h1 className='text-[#F1F5F9] text-4xl font-poppins'>Featured Books</h1>
      <div className={`flex flex-wrap justify-center items-center gap-10 mt-[10px] transition duration-300 ${selectedBook || showAlert ? 'blur-sm' : ''}`}>
        {booksDataState.map((data) => (
          <div 
            key={data.id} 
            className="flex flex-col items-center p-4 rounded-lg shadow-[rgba(0,0,0,0.1)] w-[250px] h-[350px] bg-[#0F172A]"
          >
            <img 
              src={data.coverImg} 
              alt={data.title} 
              className="h-45 w-38 object-cover mb-4 rounded-md"
            />
            <h1 className="text-lg font-bold text-center text-[#F1F5F9] font-poppins">{data.title}</h1>
            <h3 className="text-sm text-[#94A3B8] mb-4">{data.author}</h3>
            <button 
              className="px-4 py-2 bg-[#193c8e] text-[#94A3B8] hover:text-white w-[100px] mt-2 rounded-[3px] transition duration-300"
              type="button"
              onClick={() => handleViewClick(data)}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* Modal Section for selected book */}
      {selectedBook && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-lg z-50">
          <div className="bg-[#121722] p-8 h-[90vh] w-[90%] rounded-lg max-w-4xl mx-auto relative border border-white overflow-y-auto">
            {/* Close Button */}
            <button 
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center"
            >
              X
            </button>

            {/* Content Layout */}
            <div className="flex gap-6 h-full">
              {/* Book Image */}
              <img 
                src={selectedBook.coverImg} 
                alt={selectedBook.title} 
                className="w-70 h-90 mt-10 object-cover rounded-md"
              />

              {/* Book Info (left-aligned) */}
              <div className="flex flex-col justify-start items-start text-left w-full mt-10">
                <h2 className="text-3xl font-bold font-poppins text-[#F1F5F9] mb-2">{selectedBook.title}</h2>
                <h4 className="text-xl text-[#94A3B8] italic mb-4">by {selectedBook.author}</h4>
                <p className="text-[#F1F5F9] text-base mb-4">{selectedBook.description}</p>
                <div>
                  <a 
                  href={selectedBook.pdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#193c8e] text-white rounded-md mt-2"
                >
                  Read PDF
                </a>
                </div>
                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-yellow-400 text-2xl">⭐</span>
                    <span className="text-lg font-bold text-white">
                      {(() => {
                        const rating = calculateBookRating(selectedBook.likes, selectedBook.dislikes, comments[selectedBook.id]?.length || 0);
                        return rating ? `${rating} / 5` : 'No rating yet';
                      })()}
                    </span>
                    <span className="ml-2 text-gray-400 text-sm">({selectedBook.likes || 0} likes, {selectedBook.dislikes || 0} dislikes, {comments[selectedBook.id]?.length || 0} comments)</span>
                  </div>
                  <div className="flex gap-4">
                    <button
                      className={`relative flex items-center gap-2 px-5 py-2 rounded-full border border-transparent font-semibold transition-transform duration-200 focus:outline-none shadow-sm
                        ${likeAnim[selectedBook.id] ? 'scale-110' : ''}
                        ${bookLikes[selectedBook.id] === 'like' ? 'bg-green-500 text-white' : 'bg-gray-800 text-green-600 hover:bg-green-100 hover:text-green-700'}
                        ${bookLikes[selectedBook.id] === 'like' ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                      onClick={() => handleBookLike(selectedBook.id, 'like')}
                      disabled={!user || bookLikes[selectedBook.id] === 'like'}
                      title={bookLikes[selectedBook.id] === 'like' ? 'You liked this!' : 'Like this book'}
                    >
                      <span className="font-bold">Like</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm font-bold">{selectedBook.likes || 0}</span>
                    </button>
                    <button
                      className={`relative flex items-center gap-2 px-5 py-2 rounded-full border border-transparent font-semibold transition-transform duration-200 focus:outline-none shadow-sm
                        ${dislikeAnim[selectedBook.id] ? 'scale-110' : ''}
                        ${bookLikes[selectedBook.id] === 'dislike' ? 'bg-red-600 text-white' : 'bg-gray-800 text-red-500 hover:bg-red-100 hover:text-red-700'}
                        ${bookLikes[selectedBook.id] === 'dislike' ? 'cursor-not-allowed' : 'hover:scale-105'}`}
                      onClick={() => handleBookLike(selectedBook.id, 'dislike')}
                      disabled={!user || bookLikes[selectedBook.id] === 'dislike'}
                      title={bookLikes[selectedBook.id] === 'dislike' ? 'You disliked this!' : 'Dislike this book'}
                    >
                      <span className="font-bold">Dislike</span>
                      <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm font-bold">{selectedBook.dislikes || 0}</span>
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
                    {selectedBook && comments[selectedBook.id] && comments[selectedBook.id].length > 0 ? (
                      comments[selectedBook.id].map((comment, index) => (
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
                          <div className="flex gap-4 ml-10 mt-2">
                            <button
                              className={`flex items-center gap-1 px-2 py-1 rounded border ${commentLikes[`${selectedBook.id}_${index}`]==='like' ? 'bg-green-600 text-white' : 'border-gray-500 text-gray-300'}`}
                              disabled={!user}
                              onClick={() => handleLikeDislike(selectedBook.id, index, 'like')}
                            >
                              👍 {comment.likes || 0}
                            </button>
                            <button
                              className={`flex items-center gap-1 px-2 py-1 rounded border ${commentLikes[`${selectedBook.id}_${index}`]==='dislike' ? 'bg-red-600 text-white' : 'border-gray-500 text-gray-300'}`}
                              disabled={!user}
                              onClick={() => handleLikeDislike(selectedBook.id, index, 'dislike')}
                            >
                              👎 {comment.dislikes || 0}
                            </button>
                          </div>
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

      {/* Alert popup if not logged in */}
      {showAlert && <AlertPopup closeAlert={closeAlert} />}
    </div>
  );
};

export default FeturedSection;
