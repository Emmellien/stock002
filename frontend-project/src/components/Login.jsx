import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', creds);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.user.username);
      localStorage.setItem('ShopkeeperId', res.data.user.id);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-slate-900 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header Area */}
        <div className="text-center mb-10">
          <div className="inline-block p-3 rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/50 mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Berwa shop</h1>
          <p className="text-blue-400 font-medium mt-2">berwa Shop Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <div>
              <label className="block text-blue-200 text-sm font-semibold mb-2 ml-1">Username</label>
              <input 
                type="text" 
                placeholder="Enter your username" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={(e) => setCreds({...creds, username: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className="block text-blue-200 text-sm font-semibold mb-2 ml-1">Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                onChange={(e) => setCreds({...creds, password: e.target.value})} 
                required 
              />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-600/30 transition transform hover:scale-[1.02] active:scale-[0.98]">
              Log In to Dashboard
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm">
              Authorized Personnel Only
            </p>
          </div>
        </div>
        
        <p className="text-center text-gray-500 text-xs mt-8">
          &copy; 2026 Berwa shop . All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;