import { useState, useEffect, useContext, useCallback } from "react";
import "../css/Mail.css";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
import { MdLabelImportantOutline } from "react-icons/md";
import { MdLabelImportant } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoIosCheckboxOutline } from "react-icons/io";
import { BiTrash } from "react-icons/bi";
import { AuthContext } from '../../contexts/AuthContext';
import ComposeWindow from "./ComposeWindow";
import { MailContext } from "../../contexts/MailContext";

function Mail({ mail }) {
  const [isSelected, setisSelected] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isImportant, setisImportant] = useState(false);
  const [isDraft, setIsDraft] = useState(null);
  const [user, setUser] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const { username } = useContext(AuthContext);
  const { currentFolder, fetchMails } = useContext(MailContext)


  const handleStarClicked = useCallback(async () => {
    if (isDraft) return;
    setIsStarred(!isStarred);

    const res1 = await fetch(`/api/labels/name/starred`, {
      credentials: "include",
    })
    if (res1.status !== 200) {
      throw new Error('Label not found')
    }
    const label = await res1.json();
    if (!isStarred) {
      const res2 = await fetch(`/api/labelsAndMails/${mail.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ labelId: label.id })
      })

      if (res2.status !== 201) {
        throw new Error('Error while adding to star')
      }
      fetchMails(currentFolder)
    } else {
      const res2 = await fetch(`/api/labelsAndMails/${mail.id}/${label.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ labelId: label.id })
      })

      if (res2.status !== 204) {
        throw new Error('Error while removing from star')
      }
      fetchMails(currentFolder)
    }
  }, [isDraft, isStarred, currentFolder, fetchMails, mail.id]);

  const handleImportantClicked = useCallback(async () => {
    if (isDraft) return;

    setisImportant(!isImportant);

    const res1 = await fetch(`/api/labels/name/important`, {
      credentials: "include",
    })
    if (res1.status !== 200) {
      throw new Error('Label not found')
    }
    const label = await res1.json();
    if (!isImportant) {
      const res2 = await fetch(`/api/labelsAndMails/${mail.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ labelId: label.id })
      })

      if (res2.status !== 201) {
        throw new Error('Error while adding to important')
      }
      fetchMails(currentFolder)
    } else {
      const res2 = await fetch(`/api/labelsAndMails/${mail.id}/${label.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ labelId: label.id })
      })

      if (res2.status !== 204) {
        throw new Error('Error while removing from important')
      }
      fetchMails(currentFolder)
    }
  }, [isDraft, isImportant, currentFolder]);
 

  async function handleClicked(e) {
    const response = await fetch(`/api/users/by-username/${username}`);
    if (!response.ok) throw new Error('User not found');

    const currUser = await response.json();

    if (mail.to === currUser.id && currentFolder !== "drafts") {
      const res = await fetch(`/api/mails/${mail.id}/read/${currentFolder}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: mail.to })
      });
      if (res.status !== 204) {
        return null;
      }
      if (e.target.closest(".selectIcon, .starIcon, .importantIcon, .deleteIcon")) return;
    }
    fetchMails(currentFolder);
  }

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/users/${mail.from}`, {
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
    fetchMails(currentFolder)
    fetchUser();
  }, [mail.from]);



  useEffect(() => {
    checkIfDraft();
    checkStarred();
    checkImportant();
  }, [currentFolder]);

  const handleClick = (e) => {
    if (currentFolder === "drafts") {
      setShowCompose(true);
    } else {
      handleClicked(e);
    }
  };

  const handleDelete = async (e) => {
    console.log("isDraft", isDraft, mail.id, mail.labels);
    console.log("mail.labels:", mail.labels);
    e.stopPropagation();
    if (isDraft) {
      await fetch(`/api/drafts/${mail.id}`, {
        method: "DELETE",
        credentials: "include",
      });
    } else {
      await fetch(`/api/mails/${mail.id}`, {
        method: "DELETE",
        credentials: "include",
      });
    }
    fetchMails(currentFolder);
  };


  return (
    <>
      <div
        className={`mailRow surface${mail.read ? "read" : "unread"}`}
        onClick={handleClick}
        tabIndex={0}
        role="button"
      >
        <button
          className="selectIcon"
          onClick={(e) => {
            e.stopPropagation();
            setisSelected(!isSelected);
          }}
        >
          {isSelected ? (
            <span id="selectOn">
              <IoIosCheckboxOutline />
            </span>
          ) : (
            <MdCheckBoxOutlineBlank />
          )}
        </button>
        <button
          className="starIcon"
          onClick={(e) => {
            e.stopPropagation();
            handleStarClicked();
          }}
        >
          {isStarred ? (
            <span id="starOn">
              <MdOutlineStar />
            </span>
          ) : (
            <MdOutlineStarBorder />
          )}
        </button>
        <button
          className="importantIcon"
          onClick={(e) => {
            e.stopPropagation();
            handleImportantClicked();
          }}
        >
          {isImportant ? (
            <span id="importantOn">
              <MdLabelImportant />
            </span>
          ) : (
            <MdLabelImportantOutline />
          )}
        </button>
        <button className="deleteIcon" onClick={handleDelete}>
          <BiTrash />
        </button>
        <span className="mailSender">{user ? user.name : "Loading..."}</span>
        <div className="mailContent">
          <span className="mailSubject">{mail.subject}</span>
          <span className="mailBody"> - {mail.body}</span>
        </div>
      </div>
      {showCompose && (
        <ComposeWindow />
      )}
    </>
  );
}

export default Mail;
