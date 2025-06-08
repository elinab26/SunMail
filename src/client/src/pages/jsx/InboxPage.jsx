import React, { useState, useRef } from 'react';
import TopBar from '../../components/jsx/TopBar';
import Sidebar from '../../components/jsx/Sidebar';
import '../css/InboxPage.css';

export default function InboxPage() {
  // State to control if the sidebar is open (toggled by button)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // State to control if the sidebar is hovered (for temporary open)
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  // Ref to store the hover timeout ID
  const hoverTimeout = useRef(null);

  // When mouse enters sidebar area, set a timeout to show sidebar if it's closed
  const handleSidebarMouseEnter = () => {
    if (!isSidebarOpen) {
      hoverTimeout.current = setTimeout(() => setIsSidebarHovered(true), 300);
    }
  };

  // When mouse leaves sidebar area, clear timeout and hide sidebar if it's closed
  const handleSidebarMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    if (!isSidebarOpen) setIsSidebarHovered(false);
  };

  // Sidebar is visible if open or being hovered
  const sidebarVisible = isSidebarOpen || isSidebarHovered;

  return (
    <div className="app-container">
      {/* TopBar with button to toggle sidebar */}
      <TopBar toggleSidebar={() => setIsSidebarOpen(open => !open)} />
      <div className="main-content">
        {/* Sidebar area with mouse events for hover logic */}
        <div
          onMouseEnter={handleSidebarMouseEnter}
          onMouseLeave={handleSidebarMouseLeave}
          style={{ height: '100%' }}
        >
          <Sidebar isOpen={sidebarVisible} />
        </div>
        {/* Main inbox content */}
        <div className="inbox-content">
          <h2>Inbox</h2>
          <ul className="email-list">
            <li>Email 1</li>
            <li>Email 2</li>
            <li>Email 3</li>
          </ul>
          <p className="no-emails">No emails to display at the moment.</p>
        </div>
      </div>
    </div>
  );
}
