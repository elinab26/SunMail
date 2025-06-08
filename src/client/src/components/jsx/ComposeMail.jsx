import React from 'react';
import '../css/ComposeMail.css';

export default function ComposeMailButton({ onClick }) {
  return (
    <button className="compose-mail-btn" onClick={onClick}>
      + New Message
    </button>
  );
}
