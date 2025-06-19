import React, { useState, useContext, useEffect } from 'react';
import { MdMenu } from 'react-icons/md';
import { FiSearch, FiMoon, FiSun } from 'react-icons/fi'; // ←
import '../css/TopBar.css';
import { useNavigate } from 'react-router-dom';
import sunMailImg from '../../assets/sunmail_logo.png';
import { AuthContext } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import UserDetailsPopup from './UserDetailsPopup';


export default function TopBar({ toggleSidebar }) {
  const navigate = useNavigate();
  const { logout, isLoggedIn, username, userChecked } = useContext(AuthContext);

  const [query, setQuery] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  /* --- Dark-mode state persists in localStorage --- */
  const { darkMode, toggleTheme } = useTheme();


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
      console.log("hello")
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setQuery('');
    }
  };

  return (
    <>
      {/* {darkMode && <div className="sunset-scene"></div>} */}
      <header className="topbar surface">
        {/* 1️⃣ Menu button */}
        <div className="topbar-left">
          <button className="menu-btn" onClick={toggleSidebar}>
            <MdMenu size={24} />
          </button>

        {/* 2️⃣ Logo */}
        <div className="topbar-logo">
          <img src={sunMailImg
          
          } alt="Gmail" className="logo-image" />
        </div>
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

      {/* 4️⃣ Theme toggle  */}
      <div className="topbar-right">
        <button
          className="theme-btn btn-ripple"
          onClick={toggleTheme}
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>

        {/* 5️⃣ User info */}
        {isLoggedIn && userInfo && (
          <div
            className="topbar-userinfo-container"
            onMouseEnter={() => setShowUserDetails(true)}
            onMouseLeave={() => setShowUserDetails(false)}
          >
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
              
            </div>
            {showUserDetails && <UserDetailsPopup user={userInfo} />}
          </div>
        )}

        {/* 6️⃣ Logout */}
        {isLoggedIn && (
          <button className="logout-btn" onClick={logout}>Logout</button>
        )}
      </div>
    </header>
    </>
  );
}
