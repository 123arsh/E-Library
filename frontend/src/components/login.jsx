import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9000/login', {
        email,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem('userName', response.data.fullname || 'User');
        navigate('/');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen shadow-xl/30">
      <Link to="/" className="mb-[30px]">
        <img src="/icons/cancel.png" className="h-10 w-10 border border-white rounded-full bg-[#94A3B8]" />
      </Link>

      <div className="flex flex-col items-center border-2 bg-[#0e131b] border-[#94A3B8] rounded-3xl p-8 sm:w-[90%] md:w-[500px]">
        <h1 className="text-white font-poppins text-[24px] mb-4">Login to Account</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form className="flex flex-col w-full" onSubmit={handleLogin}>
          {/* Email */}
          <div className="border border-[#94A3B8] rounded-2xl p-4 mb-4">
            <label className="block text-[#94A3B8] font-inter mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-3 py-2 w-full rounded-xl text-[#94A3B8] bg-transparent border border-gray-600"
              placeholder="Enter Email Address"
              pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
              required
            />
          </div>

          {/* Password */}
          <div className="border border-[#94A3B8] rounded-2xl p-4 mb-4">
            <label className="block text-[#94A3B8] font-inter mb-2">Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-3 py-2 w-full rounded-xl text-[#94A3B8] bg-transparent border border-gray-600"
              placeholder="Enter Password"
              required
            />
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="mr-2"
              />
              <label className="text-[#94A3B8] font-sans text-sm">Show Password</label>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="h-[45px] w-full rounded-2xl border border-[#94A3B8] text-[#94A3B8] font-inter mt-2 hover:bg-[#94A3B8] hover:text-black transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Signup Link */}
        <p className="text-[#94A3B8] mt-4 text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-400 underline">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
