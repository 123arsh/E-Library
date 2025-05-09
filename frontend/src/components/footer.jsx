import React from 'react';
import { FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0b0f12] border-t border-[#1e293b] text-gray-400 py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center   gap-6 items-center text-sm">

        {/* Left - Logo (clickable for mail) + Copyright */}
        <div className="flex items-center gap-4 mb-4 md:mb-0">
        
          <span>©All rights reserved</span>
        </div>

        {/* Right - Icons */}
        <div className="flex items-center gap-4">
          <a href="mailto:arshhhhdip@gmail.com" className="hover:text-white transition">
            <FaEnvelope className="text-blue-400 text-lg" />
          </a>
          <a
            href="https://www.linkedin.com/in/arshdeep07/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <FaLinkedin className="text-blue-500 text-lg" />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;