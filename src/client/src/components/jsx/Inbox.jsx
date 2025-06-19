import { useEffect, useContext } from "react";
import { MailContext } from "../../contexts/MailContext";
import "../css/Inbox.css";
import Mail from "./Mail";
import { useNavigate } from "react-router-dom";

function Inbox() {
  const { mails = [], fetchMails, currentFolder, setDraftId, setIsNewDraft, setIsComposeOpen, setIsMinimized } = useContext(MailContext);
  const navigate = useNavigate();
  useEffect(() => {
    fetchMails(currentFolder);
  }, []);

  function handleDraftClick(draft) {
    setDraftId(draft.id);
    setIsNewDraft(false);
    setIsComposeOpen(true);
    setIsMinimized(false);
  }


  return (
    <div className="Mails">
      {(mails || []).map((mail) => (
        <span key={mail.id} onClick={() => {
          if (currentFolder === "drafts") {
            handleDraftClick(mail)
          }
          navigate(`/${currentFolder}/${mail.id}`)
        }}>
          <Mail
            mail={mail}
            fetchMails={fetchMails}
            currentFolder={currentFolder}
          />
        </span>
      ))}
    </div>
  );
}

export default Inbox;
