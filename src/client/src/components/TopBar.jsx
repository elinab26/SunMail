import React from 'react';


export default function TopBar() {
  return (
    <header className="topbar">
      <div className="logo">MaBoîteMail</div>
      {/* Placeholder pour champ recherche + bouton thème + bouton déconnexion */}
      <div className="topbar-actions">
        <input type="text" placeholder="Rechercher…" className="search-input" />
        <button type="button" className="theme-toggle-btn">🌞/🌜</button>
        <button type="button" className="logout-btn">Déconnexion</button>
      </div>
    </header>
  );
}
