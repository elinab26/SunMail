import { useContext, useState, useEffect } from "react";
import { MailContext } from "../../contexts/MailContext";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../css/MailPage.css";
import LabelsModal from "../../components/jsx/LabelsModal";
import LabelsMailList from "./LabelsMailList";
const DEFAULT_LABELS = ["starred", "snoozed", "important", "sent", "drafts", "trash", "archive"];

function MailPage() {
  const { mails, fetchMails, currentFolder } = useContext(MailContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);
  const [labelsUser, setLabelsUser] = useState([]);

  async function fetchLabels() {
    const res = await fetch("/api/labels", {
      credentials: "include",
    });
    const json = await res.json();
    setLabelsUser(json);
  }

  useEffect(() => {
    fetchLabels();
  }, [])

  const mail1 = mails.find((m) => m.id === id);
  useEffect(() => {
    if (!mail1) return;
    async function fetchUser() {
      const res = await fetch(`/api/users/${mail1.from}`, {
        credentials: "include",
      });
      if (res.status !== 200) {
        alert("Error");
        setUser(null);
        return;
      }
      const json = await res.json();
      setUser(json);
    }
    fetchUser();
  }, [mail1]);

  const mail = mails.find((m) => m.id === id);
  if (!mail) return <div>Mail not found</div>;



  async function handleOpenLabels() {
    if (labelsUser.length === 0) {
      const res = await fetch("/api/labels", { credentials: "include" });
      if (res.ok) {
        setLabelsUser(await res.json());
      }
    }
    setIsLabelsModalOpen(true);
  }

  async function handleSelectLabel(label) {
    const res = await fetch(`/api/labelsAndMails/${mail.id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ labelId: label.id })
    })
    if (res.status !== 201) {
      alert("Adding mail to label failed.");
    }
    setIsLabelsModalOpen(false);
    setLabelsUser([...labelsUser]);
    fetchMails(currentFolder)
    if (label.name === "spam") {
      navigate("..")
    }

  }

  async function handleRemoveLabel(labelId) {
    const res = await fetch(`/api/labelsAndMails/${mail.id}/${labelId}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (res.status !== 200 && res.status !== 204) {
      alert("Error while removing label from mail");
      return;
    }

    mail.labels = mail.labels.filter(lab =>
      typeof lab === "object" ? lab.id !== labelId : lab !== labelId
    );

    setLabelsUser(prev => prev)
    fetchMails(currentFolder)
    navigate("..");

  }

  const mailLabelObjects = labelsUser
    .filter(lab => {
      const mailLabIds = mail.labels.map(l => typeof l === "object" ? l.id : l);
      return mailLabIds.includes(lab.id)
        && !DEFAULT_LABELS.includes(lab.name);
    });

  return (
    <div className="mail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={25} />
      </button>

      <div className="header">
        <p className="subject">{mail.subject}</p>
        <LabelsMailList
          mailLabelObjects={mailLabelObjects}
          user={user}
          labelsUser={labelsUser}
          handleRemoveLabel={handleRemoveLabel}
          setLabelsUser={setLabelsUser} />

        <button
          className="add-label-btn"
          onClick={e => {
            e.target.blur();
            handleOpenLabels();
          }}
        >+ Add To Label</button>
      </div>

      <div className="divider" />

      <div className="mail-view">
        <div className="from">
          {user ? (
            user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="profile"
                className="from-img"
              />
            ) : (
              <div className="from-fallback">
                {user ? user.name[0].toUpperCase() : "?"}
              </div>
            )
          ) : (
            <div>Loading...</div>
          )}
          <p className="from-name">
            {user ? user.name : mail.from}
          </p>
        </div>
        <p className="mail-body">{mail.body}</p>
      </div>
      {isLabelsModalOpen && (
        <LabelsModal
          labels={labelsUser}
          onClose={() => setIsLabelsModalOpen(false)}
          onSelect={handleSelectLabel}
          mail={mail}
        />
      )}
    </div>
  );
}

export default MailPage;