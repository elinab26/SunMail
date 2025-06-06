import React from 'react';
import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';

export default function InboxPage() {
  return (
    <div className="app-container">
      <TopBar />
      <div className="main-content">
        <Sidebar />
        <div className="inbox-content">
          <h2>Boîte de réception</h2>
          {/* Ici on mettra la liste de mails */}
        </div>
      </div>
    </div>
  );
}
