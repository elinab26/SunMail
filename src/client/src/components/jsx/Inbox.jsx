import { useState, useEffect, useRef } from "react";
import "../css/Inbox.css";
import Mail from "./Mail";

function Inbox({ mails, fetchMails }) {
  useEffect(() => {
    fetchMails();
  }, []);

  return (
    <div>
      <span className="Mails">
        {mails.map((mail) => (
          <span key={mail.id}>
            <Mail mail={mail} fetchMails={fetchMails} />
          </span>
        ))}
      </span>
    </div>
  );
}

export default Inbox;
