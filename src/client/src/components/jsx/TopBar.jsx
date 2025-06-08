// src/client/src/components/jsx/TopBar.jsx
import React, { useState, useContext, useEffect } from 'react';
import { MdMenu } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import '../css/TopBar.css';
import { useNavigate } from 'react-router-dom'
import gmailImg from '../../assets/gmailLogo.png';
import { AuthContext } from '../../contexts/AuthContext';


export default function TopBar({ toggleSidebar }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { logout, isLoggedIn, username} = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    if (isLoggedIn && username) {
      fetch(`/api/users/by-username/${username}`)
        .then(res => res.ok ? res.json() : null)
        .then(data => setUserInfo(data));
    }
  }, [isLoggedIn, username]);

  const handleSearchSubmit = e => {
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

      {isLoggedIn && userInfo && (
        <div className="topbar-userinfo">
          <img src={userInfo.image} alt="profile" className="topbar-userinfo-img" />
          <span className="topbar-userinfo-name">
            {userInfo.first_name}{userInfo.last_name ? ' ' + userInfo.last_name : ''}
          </span>
        </div>
      )}
      {isLoggedIn && (
        <button className="logout-btn" onClick={logout}>Logout</button>
      )}
    </header>
  );
}
