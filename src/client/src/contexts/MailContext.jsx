// MailContext.jsx
import { createContext, useState } from "react";

export const MailContext = createContext();

export function MailProvider({ children }) {
    const [draftId, setDraftId] = useState(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isNewDraft, setIsNewDraft] = useState(false);
    const [currentFolder, setCurrentFolder] = useState("inbox");
    const [mails, setMails] = useState([]);

    async function fetchMails(currentFolder) {
        var res;
        if (currentFolder == "drafts") {
            res = await fetch(`http://localhost:8080/api/mails/drafts`, {
                credentials: "include",
            });
        } else {
            res = await fetch(`http://localhost:8080/api/mails/label/${currentFolder}`, {
                credentials: "include",
            });
        }
        const json = await res.json();
        setMails(json);
    }
    return (
        <MailContext.Provider
            value={{
                draftId,
                setDraftId,
                isComposeOpen,
                setIsComposeOpen,
                isMinimized,
                setIsMinimized,
                isNewDraft,
                setIsNewDraft,
                currentFolder,
                setCurrentFolder,
                fetchMails,
                mails,
                setMails
            }}
        >
            {children}
        </MailContext.Provider>
    );
}
