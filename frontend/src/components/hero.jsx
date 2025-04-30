import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
    <div className="flex items-center flex-col w-full text-black bg-[#080d13]">
      <div className="mt-[100px] border-1 border-[#94A3B8] h-[150px] w-[600px] rounded-2xl">
        <form onSubmit={handleSearch}>
          <h1 className="font-inter text-[36px] text-white">Welcome to the Library</h1>
          <p className="font-poppins text-[16px] text-[#94A3B8]">Explore thousands of Books Online</p>
          <div className="flex flex-row justify-between items-center border-1 border-[#94A3B8] h-[45px] text-[#94A3B8] rounded-2xl">
            <input
              type="text"
              className="ml-2 border-none w-full outline-none bg-transparent text-white"
              placeholder="Search Books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="mr-2 text-white">
              🔍
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Hero;