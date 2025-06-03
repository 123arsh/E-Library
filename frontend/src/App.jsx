import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Alert from './components/alert';
import Navbar from './components/navbar'; 
import Signup from './pages/signup';
import Login from './pages/login';
import Hero from './components/hero';
import FeturedSection from './components/feturedSection';
import Footer from './components/footer';
import SearchResults from './components/SearchResults';
import Home from './pages/home'
import List from './components/list';

const MainLayout = () => (
  <>
    <div><Navbar /></div>
    <div><Hero /></div>
    <div className='pb-[150px]'><FeturedSection /></div>
    <div className='pt-[100px]'><List/></div>
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

            <Route path='/alert' element={ <Alert/> } />

          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
