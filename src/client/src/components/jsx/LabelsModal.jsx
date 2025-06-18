// components/LabelsModal.jsx
import React from "react";
import "../css/LabelsModal.css";

export default function LabelsModal({ labels, onClose, onSelect }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="labels-modal"
        onClick={e => e.stopPropagation()} 
      >
        <h2>Add To Label</h2>
        <ul className="labels-list">
          {labels.map(label => (
            <li key={label.id}>
              <button
                className="label-btn"
                onClick={() => onSelect(label)}
              >
                {label.name}
              </button>
            </li>
          ))}
        </ul>
        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
