import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [userName, setUserName] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    setUserName(storedName);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userName');
    setUserName(null);
    navigate('/login');
  };

  return (
    <div className="fixed flex justify-between border-b-2 border-[#94A3B8] sm:w-full w-[414px] h-[45px] bg-[#0e131b] z-10 px-4">
      <h1 className="text-white self-center font-poppins text-xl sm:text-lg">E-Library</h1>

      {userName ? (
        <div className="relative text-white font-poppins text-sm sm:text-lg">
          <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-1">
            Hi, {userName.split(' ')[0]} ▼
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-[#1f2937] border border-[#94A3B8] rounded shadow p-2">
              <button onClick={handleLogout} className="text-red-400 hover:text-red-600">
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link 
          to="/login" 
          className="flex items-center text-white font-poppins text-sm sm:text-lg"
        >
          Login
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2"
          >
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </Link>
      )}
    </div>
  );
};

export default Navbar;
