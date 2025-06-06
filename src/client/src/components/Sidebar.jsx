import React from 'react';


export default function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li>Inbox</li>
        <li>Envoyés</li>
        <li>Brouillons</li>
        <li>Spam</li>
      </ul>
      <hr />
      <div className="labels-section">
        <h4>Libellés</h4>
        <ul>
          <li>Personnel</li>
          <li>Travail</li>
          <li>Important</li>
        </ul>
      </div>
    </nav>
  );
}
