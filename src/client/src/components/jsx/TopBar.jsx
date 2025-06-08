// src/client/src/components/jsx/TopBar.jsx
import React, { useState } from 'react';
import { MdMenu } from 'react-icons/md';
import { FiSearch } from 'react-icons/fi';
import '../css/TopBar.css';
import { useNavigate } from 'react-router-dom'
import gmailImg from '../../assets/gmailLogo.png';

export default function TopBar({ toggleSidebar }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

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

      {/* 4️⃣ Logout… */}
      <button className="logout-btn">Logout</button>
    </header>
  );
}
