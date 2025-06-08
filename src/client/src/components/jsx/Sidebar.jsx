// src/client/src/components/Sidebar.jsx
import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineInbox, AiOutlineStar, AiOutlineClockCircle, AiOutlineFile } from 'react-icons/ai';
import { BiTrash, BiEnvelope, BiLabel, BiSend } from 'react-icons/bi';
import { RiSpam2Line } from "react-icons/ri";
import { MdExpandMore, MdOutlineSettings, MdScheduleSend } from "react-icons/md";
import { BsChatLeftText } from "react-icons/bs";
import { LuPencil } from "react-icons/lu";
import '../css/Sidebar.css';

export default function Sidebar({ isOpen, currentFolder, onSelectFolder, counts }) {
  // State to manage the display of the "More" / "Less" section
  const [showMore, setShowMore] = useState(false);
  const primaryFolders = [
    {
      key: 'inbox',
      label: 'Inbox',
      icon: <AiOutlineInbox size={20} />,
      count: counts?.inbox || 0,
    },
    {
      key: 'starred',
      label: 'Starred',
      icon: <AiOutlineStar size={20} />,
      count: null,
    },
    {
      key: 'snoozed',
      label: 'Snoozed',
      icon: <AiOutlineClockCircle size={20} />,
      count: null,
    },
    {
      key: 'important',
      label: 'Important',
      icon: <BiLabel size={20} />,
      count: null,
    },
    {
      key: 'sent',
      label: 'Sent',
      icon: <BiSend size={20} />,
      count: null,
    },
    {
      key: 'drafts',
      label: 'Drafts',
      icon: <AiOutlineFile size={20} />,
      count: counts?.drafts || 0,
    },
  ];
  const secondaryFolders = [
    {
      key: 'chats',
      label: 'All chats',
      icon: <BsChatLeftText size={20} />,
      count: null
    },

    {
      key: 'scheduled',
      label: 'Scheduled',
      icon: <MdScheduleSend size={20} />,
      count: null
    },

    {
      key: 'all',
      label: 'All mail',
      icon: <BiEnvelope size={20} />,
      count: null
    },
    {
      key: 'spam',
      label: 'Spam',
      icon: <RiSpam2Line size={20} />,
      count: null,
    },

    {
      key: 'trash',
      label: 'Trash',
      icon: <BiTrash size={20} />,
      count: null
    },

    {
      key: 'manage',
      label: 'Manage labels',
      icon: <MdOutlineSettings size={20} />,
      count: null
    },

    {
      key: 'create',
      label: 'Create label',
      icon: <AiOutlinePlus size={20} />,
      count: null
    },

  ];
  return (
    <nav className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      {/* New message button */}
      <button
        className="sidebar-compose-btn"
        title="New message"
      >
        <LuPencil size={22} style={{ marginRight: isOpen ? 8 : 0 }} />
        {isOpen && <span>New message</span>}
      </button>

      {/* List of primary folders */}
      <ul className="sidebar-folders">
        {primaryFolders.map(folder => (
          <li
            key={folder.key}
            className={`sidebar-folder-item ${currentFolder === folder.key ? 'active' : ''}`}
            onClick={() => onSelectFolder(folder.key)}
          >
            <span className="folder-icon">{folder.icon}</span>
            <span className="folder-label">{folder.label}</span>
            {folder.count != null && (
              <span className="folder-count">{folder.count}</span>
            )}
          </li>
        ))}
      </ul>
      <div
        className="sidebar-folder-item sidebar-more-toggle"
        onClick={() => setShowMore(prev => !prev)}
      >
        <span className="folder-icon">
          {showMore ? <MdExpandMore size={20} /> : <AiOutlinePlus size={20} />}</span>
        <span className="folder-label">
          {showMore ? 'Less' : 'More'}
        </span>
      </div>

      {/* If showMore === true, display the additional block */}
      {showMore && (
        <ul className="sidebar-folders sidebar-more-list">
          {secondaryFolders.map(folder => (
            <li
              key={folder.key}
              className="sidebar-folder-item"
              onClick={() => onSelectFolder(folder.key)}
            >
              <span className="folder-icon">{folder.icon}</span>
              <span className="folder-label">{folder.label}</span>
              {folder.count != null && (
                <span className="folder-count">{folder.count}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
