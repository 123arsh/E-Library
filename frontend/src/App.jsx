import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from './components/navbar'; 
import Signup from './components/signup';
import Login from './components/login';
import Hero from './components/hero';
import FeturedSection from './components/feturedSection';
import Genre from './components/genre';
import Footer from './components/footer';
import SearchResults from './components/SearchResults'; // ✅ <-- Import this

const MainLayout = () => (
  <>
    <div className='pb-[100px]'><Navbar /></div>
    <div className='pb-[100px]'><Hero /></div>
    <div className='pb-[100px]'><FeturedSection /></div>
    <div className='pb-[100px]'><Genre /></div>
    <div className='pt-[100px]'><Footer /></div>
  </>
);

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div className='bg-[#0b0f12]'>
          <Routes>
            {/* Standalone pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Search results page */}
            <Route path="/search" element={<SearchResults />} /> {/* ✅ Add this */}

            {/* Home route with layout */}
            <Route path="/" element={<MainLayout />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
