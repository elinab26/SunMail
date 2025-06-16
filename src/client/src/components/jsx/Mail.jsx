import { useState, useEffect, useContext } from "react";
import "../css/Mail.css";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
import { MdLabelImportantOutline } from "react-icons/md";
import { MdLabelImportant } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoIosCheckboxOutline } from "react-icons/io";
import { AuthContext } from '../../contexts/AuthContext';

function Mail({ mail, fetchMails, currentFolder }) {
  const [isSelected, setisSelected] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isImportant, setisImportant] = useState(false);
  const [user, setUser] = useState(null);
  const { username } = useContext(AuthContext);


  async function checkIfDraft() {
    const res1 = await fetch(`http://localhost:8080/api/labels/name/draft`, {
      credentials: "include",
    })
    if (res1.status != 200) {
      throw new Error('Label not found')
    }
    const label = await res1.json();

    const res2 = await fetch(`http://localhost:8080/api/labelsAndMails/${mail.id}/${label.id}`, {
      credentials: "include",
    })

    if (res2.status != 200) {
      return 0;
    }
    return 1;
  }


  async function handleStarClicked() {
    if (checkIfDraft() == 0) return;
    setIsStarred(!isStarred);
    const res1 = await fetch(`http://localhost:8080/api/labels/name/starred`, {
      credentials: "include",
    })
    if (res1.status != 200) {
      throw new Error('Label not found')
    }
    const label = await res1.json();
    if (!isStarred) {
      const res2 = await fetch(`http://localhost:8080/api/labelsAndMails/${mail.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ labelId: label.id })
      })

      if (res2.status != 201) {
        throw new Error('Error while adding to star')
      }
      fetchMails(currentFolder)
    } else {
      const res2 = await fetch(`http://localhost:8080/api/labelsAndMails/${mail.id}/${label.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ labelId: label.id })
      })

      if (res2.status != 204) {
        throw new Error('Error while removing to star')
      }
      fetchMails(currentFolder)
    }
  }

  async function handleImportantClicked() {
    if (checkIfDraft() == 0) return;

    setisImportant(!isImportant);
    const res1 = await fetch(`http://localhost:8080/api/labels/name/important`, {
      credentials: "include",
    })
    if (res1.status != 200) {
      throw new Error('Label not found')
    }
    const label = await res1.json();
    if (!isImportant) {
      const res2 = await fetch(`http://localhost:8080/api/labelsAndMails/${mail.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ labelId: label.id })
      })

      if (res2.status != 201) {
        throw new Error('Error while adding to star')
      }
      fetchMails(currentFolder)
    } else {
      const res2 = await fetch(`http://localhost:8080/api/labelsAndMails/${mail.id}/${label.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ labelId: label.id })
      })

      if (res2.status != 204) {
        throw new Error('Error while removing to star')
      }
      fetchMails(currentFolder)
    }
  }


  async function handleClicked(e) {
    const response = await fetch(`http://localhost:8080/api/users/by-username/${username}`);
    if (!response.ok) throw new Error('User not found');

    const currUser = await response.json();

    if (mail.to == currUser.id) {
      const res = await fetch(`http://localhost:8080/api/mails/${mail.id}/read/${currentFolder}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ to: mail.to })
      });
      if (res.status != 204) {
        return null;
      }
    }
    if (e.target.closest(".selectIcon, .starIcon, .importantIcon")) return;
    fetchMails(currentFolder);
  }

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`http://localhost:8080/api/users/${mail.from}`, {
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
  }, [mail.from]);

  return (
    <>
      <div
        className={`mailRow ${mail.read ? "read" : "unread"}`}
        onClick={handleClicked}
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
        <span className="mailSender">{user ? user.name : "Loading..."}</span>
        <div className="mailContent">
          <span className="mailSubject">{mail.subject}</span>
          <span className="mailBody"> - {mail.body}</span>
        </div>
      </div>
    </>
  );
}

export default Mail;
