import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    fetch('http://localhost:9000/user')
      .then((res) => res.json())
      .then((data) => {
        console.log('User data fetched:', data);
        setUser(data);
      })
      .catch((err) => {
        console.error('Error fetching user data:', err);
        setUser(null); // treat error as no user
      });
  }, []);

  const booksData = [
    {
      id: 1,
      title: 'Atomic Habits',
      author: 'James Clear',
      coverImg: '/booksImg/atomic-habits.jpg',
      pdf: '/books/Atomic_Habits.pdf',
      description: 'In Atomic Habits, James Clear emphasizes that tiny changes lead to remarkable results over time — success is simply the product of daily small improvements...'
    },
    {
      id: 2,
      title: 'Master Your Emotions',
      author: 'Thibaut Meurisse',
      coverImg: '/booksImg/mye.jpg',
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

  const handleViewClick = (book) => {
    if (user) {
      setSelectedBook(book);
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

  return (
    <div className="relative flex flex-col justify-center mt-[50px] gap-6 p-6 bg-[#080d13] border border-[#94A3B8] rounded-4xl">
      <h1 className='text-[#F1F5F9] text-4xl font-poppins'>Featured Books</h1>

      <div className={`flex flex-wrap justify-center items-center gap-10 mt-[10px] transition duration-300 ${selectedBook || showAlert ? 'blur-sm' : ''}`}>
        {booksData.map((data) => (
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-lg z-50">
          <div className="bg-[#121722] p-8 h-[90%] rounded-lg max-w-lg mx-auto text-center relative">
            <button 
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center"
            >
              X
            </button>
            <h2 className="text-3xl font-bold font-poppins text-[#F1F5F9] mb-2">{selectedBook.title}</h2>
            <h4 className="text-xl text-[#94A3B8] italic mb-4">by {selectedBook.author}</h4>
            <img 
              src={selectedBook.coverImg} 
              alt={selectedBook.title} 
              className="w-40 h-60 object-cover mb-4 mx-auto rounded-md"
            />
            <p className="text-[#F1F5F9] text-base mb-4">{selectedBook.description}</p>
            <a 
              href={selectedBook.pdf} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[#193c8e] text-white rounded-md inline-block mt-2"
            >
              Read PDF
            </a>
          </div>
        </div>
      )}

      {/* Alert popup if not logged in */}
      {showAlert && <AlertPopup closeAlert={closeAlert} />}
    </div>
  );
};

export default FeturedSection;
