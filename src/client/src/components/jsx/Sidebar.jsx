import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { MailContext } from "../../contexts/MailContext";
// Importing icons from various icon libraries
import {
  AiOutlinePlus,
  AiOutlineInbox,
  AiOutlineStar,
  AiOutlineClockCircle,
  AiOutlineFile,
} from "react-icons/ai";
import { BiTrash, BiEnvelope, BiLabel, BiSend } from "react-icons/bi";
import { RiSpam2Line } from "react-icons/ri";
import {
  MdExpandMore,
  MdOutlineSettings,
  MdScheduleSend,
} from "react-icons/md";
import { BsChatLeftText } from "react-icons/bs";
import { LuPencil } from "react-icons/lu";
import "../css/Sidebar.css";
import AddLabel from "./AddLabel";
import LabelMenu from "./LabelMenu";
import ComposeWindow from "./ComposeWindow"; // Ajout de l'import

// List of primary folders shown by default in the sidebar
const primaryFolders = [
  {
    key: "inbox",
    label: "Inbox",
    icon: <AiOutlineInbox size={20} />,
    countKey: "inbox",
  },
  { key: "starred", label: "Starred", icon: <AiOutlineStar size={20} /> },
  // {
  //   key: 
  //   label: "Snoozed",
  //   icon: <AiOutlineClockCircle size={20} />,
  // },
  { key: "important", label: "Important", icon: <BiLabel size={20} /> },
  { key: "sent", label: "Sent", icon: <BiSend size={20} /> },
  {
    key: "drafts",
    label: "Drafts",
    icon: <AiOutlineFile size={20} />,
    countKey: "drafts",
  },
];

// List of secondary folders shown when "More" is expanded
const secondaryFolders = [
  // { key: "chats", label: "All chats", icon: <BsChatLeftText size={20} /> },
  // { key: "scheduled", label: "Scheduled", icon: <MdScheduleSend size={20} /> },
  // { key: "all", label: "All mail", icon: <BiEnvelope size={20} /> },
  { key: "spam", label: "Spam", icon: <RiSpam2Line size={20} /> },
  { key: "trash", label: "Trash", icon: <BiTrash size={20} /> },
  // {
  //   key: "manage",
  //   label: "Manage labels",
  //   icon: <MdOutlineSettings size={20} />,
  // },
  // { key: 'create', label: 'Create label', icon: <AiOutlinePlus size={20} /> },
];



// Component to render a list of folders (either primary or secondary)
function FolderList({ folders, currentFolder, onSelectFolder, counts }) {
  return (
    <ul className="sidebar-folders">
      {folders.map(({ key, label, icon, countKey }) => (
        <li
          key={key}
          className={`sidebar-folder-item${currentFolder === key ? " active" : ""
            }`}
          onClick={() => onSelectFolder(key)}
        >
          {/* Folder icon */}
          <span className="folder-icon">{icon}</span>
          {/* Folder label */}
          <span className="folder-label">{label}</span>
          {/* Show count if available and greater than 0 */}
          {countKey && counts?.[countKey] > 0 && (
            <span className="folder-count">{counts[countKey]}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

// Main Sidebar component
export default function Sidebar({
  isOpen,
  counts,
}) {
  const { setIsNewDraft, setDraftId, currentFolder, setCurrentFolder, setIsComposeOpen, setIsMinimized } = useContext(MailContext);

  const [labels, setLabels] = useState([]);

  const navigate = useNavigate();


  function handleMenuClicked(name) {
    setCurrentFolder(name)
    navigate(`../${name}`)
  }

  async function fetchLabels() {
    const res = await fetch("/api/labels", {
      credentials: "include",
    });
    const json = await res.json();
    setLabels(json);
  }

  useEffect(() => {
    fetchLabels();
  }, []);

  // State to control whether secondary folders are shown
  const [showMore, setShowMore] = useState(false);
  const [createLabelClicked, setCreateLabelClicked] = useState(false);

  async function createDraft() {
    const res = await fetch("/api/mails/drafts", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: ' ', subject: ' ', body: ' ' })
    })
    const draft = await res.json();
    setDraftId(draft.id);
  }

  const handleOpenCompose = () => {
    createDraft();
    setIsComposeOpen(true);
    setIsMinimized(false);
    setIsNewDraft(true);
  };

  return (
    <>
      <nav className={`sidebar surface${isOpen ? "" : " collapsed"}`}>
        {/* Compose new message button */}
        <button
          className="sidebar-compose-btn btn-float"
          title="New message"
          onClick={handleOpenCompose}
        >
          <span className="folder-icon">
            <LuPencil size={22} />
          </span>
          <span className="compose-label">New message</span>
        </button>

        {/* Render primary folders */}
        <FolderList
          folders={primaryFolders}
          currentFolder={currentFolder}
          onSelectFolder={handleMenuClicked}
          counts={counts}
        />

        {/* Toggle to show/hide secondary folders */}
        <div
          className="sidebar-folder-item sidebar-more-toggle"
          onClick={() => setShowMore((v) => !v)}
        >
          <span className="folder-icon">
            {showMore ? (
              <MdExpandMore size={20} />
            ) : (
              <AiOutlinePlus size={20} />
            )}
          </span>
          <span className="folder-label">{showMore ? "Less" : "More"}</span>
        </div>

        {/* Render secondary folders if showMore is true */}
        {showMore && (
          <FolderList
            folders={secondaryFolders}
            currentFolder={currentFolder}
            onSelectFolder={handleMenuClicked}
            counts={counts}
          />
        )}

        {showMore && (
          <>
            <button
              className="sidebar-create-label"
              onClick={() => setCreateLabelClicked((v) => !v)}
            >
              <span className="folder-icon">
                <AiOutlinePlus size={20} />
              </span>
              Create label
            </button>
            {createLabelClicked && <AddLabel fetchLabels={fetchLabels} />}
            <LabelMenu labels={labels} fetchLabels={fetchLabels} />
          </>
        )}
      </nav>
      <ComposeWindow />
    </>
  );
}
