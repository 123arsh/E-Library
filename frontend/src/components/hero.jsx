import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-[#080d13] px-4 text-white">
      <div className="w-full max-w-xl border border-[#94A3B8] rounded-2xl p-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2 font-inter">Welcome to the eLibrary</h1>
        <p className="text-[#94A3B8] text-base sm:text-lg font-poppins mb-6">Explore thousands of Books Online</p>

        <form onSubmit={handleSearch} className="flex items-center border border-[#94A3B8] rounded-full px-4 py-2">
          <input
            type="text"
            className="flex-grow bg-transparent outline-none text-white placeholder-[#94A3B8] font-poppins"
            placeholder="Search Books..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="text-white text-lg ml-2">
            🔍
          </button>
        </form>
      </div>
    </div>
  );
};

export default Hero;