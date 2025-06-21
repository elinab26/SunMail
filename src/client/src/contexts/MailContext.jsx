// MailContext.jsx
import { createContext, useState, useEffect } from "react";

export const MailContext = createContext();

export function MailProvider({ children }) {
    const [draftId, setDraftId] = useState(null);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isNewDraft, setIsNewDraft] = useState(false);
    const [currentFolder, setCurrentFolder] = useState("inbox");
    const [mails, setMails] = useState([]);
    const [allMails, setAllMails] = useState([]);


    async function fetchAllMails() {
        const res = await fetch("/api/mails", { credentials: "include" });
        if (res.ok) {
            setAllMails(await res.json());
        }
    }
    useEffect(() => {
        fetchAllMails();
    }, []);

    async function fetchMails(currentFolder) {
        var res;
        res = await fetch(`/api/mails/label/${currentFolder}`, {
            credentials: "include",
        });
        const json = await res.json();
        setMails(json);
    }


    return (
        <MailContext.Provider
            value={{
                allMails,
                fetchAllMails,
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
