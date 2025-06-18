import { useContext, useState, useEffect } from "react";
import { MailContext } from "../../contexts/MailContext";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../css/MailPage.css";
import LabelsModal from "../../components/jsx/LabelsModal";
const DEFAULT_LABELS = ["starred", "snoozed", "important", "sent", "drafts", "spam", "trash", "archive"];

function MailPage() {
  const { mails } = useContext(MailContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);
  const [labelsUser, setLabelsUser] = useState([]);


  useEffect(() => {
    async function fetchLabels() {
      const res = await fetch("http://localhost:8080/api/labels", { credentials: "include" });
      if (res.ok) {
        setLabelsUser(await res.json());
      }
    }
    fetchLabels();
  }, [])

  const mail1 = mails.find((m) => m.id === id);
  useEffect(() => {
    if (!mail1) return;
    async function fetchUser() {
      const res = await fetch(`http://localhost:8080/api/users/${mail1.from}`, {
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
      const res = await fetch("http://localhost:8080/api/labels", { credentials: "include" });
      if (res.ok) {
        setLabelsUser(await res.json());
      }
    }
    setIsLabelsModalOpen(true);
  }

  async function handleSelectLabel(label) {
    const res = await fetch(`http://localhost:8080/api/labelsAndMails/${mail.id}`, {
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

  }

  async function handleRemoveLabel(labelId) {
    const res = await fetch(`http://localhost:8080/api/labelsAndMails/${mail.id}/${labelId}`, {
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

    // force le rerender des chips
    setLabelsUser(prev => prev)
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
        <div className="mail-labels">
          {mailLabelObjects.length
            ? mailLabelObjects.map(lab => {
              console.log(user)
              const labelObj = typeof lab === "object" ? lab : labelsUser.find(x => x.id === lab);
              if (!labelObj) return null;
              if (DEFAULT_LABELS.includes(labelObj.name)) return null;

              return (
                <span className="mail-label-chip" key={labelObj.id}>
                  <span className="chip-label-text">{labelObj.name}</span>
                  <button
                    className="chip-remove-btn"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await handleRemoveLabel(labelObj.id);
                    }}
                    title="Remove this label"
                    tabIndex={0}
                  >
                    &times;
                  </button>
                </span>
              );
            })
            : <span className="mail-label-chip no-label">No Labels</span>
          }
        </div>
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