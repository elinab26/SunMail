// src/client/src/pages/jsx/InboxPage.jsx
import React, { useState, useRef } from 'react';
import TopBar from '../../components/jsx/TopBar';
import Sidebar from '../../components/jsx/Sidebar';
import EmailList from '../../components/jsx/EmailList';
import '../css/InboxPage.css';

export default function InboxPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const hoverTimeout = useRef(null);
  const toggleSidebar = () => setIsSidebarOpen(open => !open);
  const sidebarShouldBeOpen = isSidebarOpen || isSidebarHovered;
  return (
    <div className="app-container">
      <TopBar toggleSidebar={toggleSidebar}/>
      <div className="main-content">
        <div
          onMouseEnter={() => {
            if (!isSidebarOpen) {
              hoverTimeout.current = setTimeout(() => {
                setIsSidebarHovered(true);
              }, 300);
            }
          }}
          onMouseLeave={() => {
            clearTimeout(hoverTimeout.current);
            if (!isSidebarOpen) setIsSidebarHovered(false);
          }}
          style={{ height: '100%' }}
        >
          <Sidebar
            isOpen={sidebarShouldBeOpen}
            /* other props: currentFolder, onSelectFolder, counts... */
          />
        </div>
        <div className="inbox-content">
          <h2>Inbox</h2>
          {/* Here we will put the email list */}
          <p>Email list coming soon...</p>
          {/* Placeholder for the email list */}
          <ul className="email-list">
            <li>Email 1</li>
            <li>Email 2</li>
            <li>Email 3</li>
            {/* Add more emails here */}
          </ul>
          <p className="no-emails">No emails to display at the moment.</p>
          {/* Placeholder for the "No emails to display" message */}
        </div>
      </div>
    </div>
  );
}
