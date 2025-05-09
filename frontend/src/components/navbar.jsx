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
    <div className="w-full bg-[#0e131b] text-white border-b border-gray-600 shadow-md px-4 py-3 flex justify-between items-center z-10">
      {/* Left: Logo */}
      <h1 className="text-2xl font-bold font-poppins">eLibrary</h1>

      {/* Right: Login or Dropdown */}
      {userName ? (
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-sm sm:text-base font-medium hover:underline flex items-center gap-1"
          >
            Hi, {userName.split(' ')[0]} ▼
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-[#1f2937] border border-gray-600 rounded shadow-md p-2 z-20">
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          className="flex items-center text-sm sm:text-base font-medium hover:underline"
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