import { useContext, useState, useEffect } from "react";
import { MailContext } from "../../contexts/MailContext";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../css/MailPage.css";
import LabelsModal from "../../components/jsx/LabelsModal";

function MailPage() {
  const { mails } = useContext(MailContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLabelsModalOpen, setIsLabelsModalOpen] = useState(false);
  const [labelsUser, setLabelsUser] = useState([]);

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
  }




  return (
    <div className="mail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={25} />
      </button>

      <div className="header">
        <p className="subject">{mail.subject}</p>
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
        />
      )}
    </div>
  );
}

export default MailPage;
