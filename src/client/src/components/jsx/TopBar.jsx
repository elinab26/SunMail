// src/client/src/components/jsx/TopBar.jsx
import React, { useState, useContext, useEffect } from 'react';
import { MdMenu } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import '../css/TopBar.css';
import { useNavigate } from 'react-router-dom';
import gmailImg from '../../assets/gmailLogo.png';
import { AuthContext } from '../../contexts/AuthContext';

export default function TopBar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { logout, isLoggedIn, username, userChecked } = useContext(AuthContext);

  const [query, setQuery] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    if (userChecked && isLoggedIn && username) {
      fetch(`/api/users/by-username/${username}`)
        .then(res => {
          if (!res.ok) throw new Error('User not found');
          return res.json();
        })
        .then(data => setUserInfo(data))
        .catch(err => {
          console.warn('⚠️ Failed to fetch user info. Logging out.');
          logout();
          navigate('/login');
        });
    }
  }, [userChecked, isLoggedIn, username, logout, navigate]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setQuery('');
    }
  };

  return (
    <header className="topbar">
      {/* 1️⃣ Hamburger button */}
      <button className="menu-btn" onClick={toggleSidebar}>
        <MdMenu size={24} />
      </button>

      {/* 2️⃣ Logo */}
      <div className="topbar-logo">
        <img src={gmailImg} alt="Gmail" className="logo-image" />
      </div>

      {/* 3️⃣ Search bar */}
      <form className="topbar-search" onSubmit={handleSearchSubmit}>
        <button type="submit" className="search-btn">
          <FiSearch size={18} />
        </button>
        <input
          type="text"
          className="search-input"
          placeholder="Search messages"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </form>

      {/* 4️⃣ User info */}
      {isLoggedIn && userInfo && (
        <div className="topbar-userinfo">
          {userInfo.profilePicture ? (
            <img
              src={userInfo.profilePicture}
              alt="profile"
              className="topbar-userinfo-img"
            />
          ) : (
            <div className="topbar-userinfo-fallback">
              {userInfo.first_name ? userInfo.first_name[0].toUpperCase() : '?'}
            </div>
          )}
          <span className="topbar-userinfo-name">
            {userInfo.first_name}
            {userInfo.last_name ? ' ' + userInfo.last_name : ''}
          </span>
        </div>
      )}

      {/* 5️⃣ Logout button */}
      {isLoggedIn && (
        <button className="logout-btn" onClick={logout}>Logout</button>
      )}
    </header>
  );
}
