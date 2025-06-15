import { useState, useEffect, useRef, useContext } from "react";
import { MailContext } from "../../contexts/MailContext";
import "../css/Inbox.css";
import Mail from "./Mail";
import { useNavigate } from "react-router-dom";

function Inbox() {
  const { mails, fetchMails } = useContext(MailContext);
  const navigate = useNavigate();
  useEffect(() => {
    fetchMails();
  }, []);

  return (
    <div className="Mails">
      {mails.map((mail) => (
        <span key={mail.id} onClick={() => navigate(`/inbox/${mail.id}`)}>
          <Mail
            mail={mail}
            fetchMails={fetchMails}
          />
        </span>
      ))}
    </div>
  );
}

export default Inbox;
