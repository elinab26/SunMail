import { useState, useEffect, useRef } from "react";
import "../css/Inbox.css";
import Mail from "./Mail";
import MailInfo from "./MailInfo";

function Inbox({ fetchMails, mails }) {
  const [selectedMail, setSelectedMail] = useState(null);

  useEffect(() => {
    fetchMails();
  }, []);

  return (
    <div>
      <span className="Mails">
        {mails.map((mail) => (
          <span key={mail.id}>
            <Mail
              mail={mail}
              onOpenMail={setSelectedMail}
              fetchMails={fetchMails}
            />
          </span>
        ))}
      </span>
      {selectedMail && <MailInfo mail={selectedMail} />}
    </div>
  );
}

export default Inbox;
