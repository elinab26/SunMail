import { useState, useEffect, useRef } from "react";
import "../css/Inbox.css";
import Mail from "./Mail";

function Inbox({ mails, fetchMails }) {
  useEffect(() => {
    fetchMails();
  }, []);

  return (
    <div>
      <ul className="Mails">
        {mails.map((mail) => (
          <li key={mail.id}>
            <Mail mail={mail} fetchMails={fetchMails} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Inbox;
