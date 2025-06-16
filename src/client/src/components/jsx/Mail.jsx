import { useState, useEffect } from "react";
import "../css/Mail.css";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
import { MdLabelImportantOutline } from "react-icons/md";
import { MdLabelImportant } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoIosCheckboxOutline } from "react-icons/io";

function Mail({ mail, fetchMails }) {
  const [isSelected, setisSelected] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isImportant, setisImportant] = useState(false);
  const [user, setUser] = useState(null);

  async function handleClicked(e) {
    const res = await fetch(`http://localhost:8080/api/mails/${mail.id}/read/inbox`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status != 204) {
      alert("Error");
      return null;
    }
    if (e.target.closest(".selectIcon, .starIcon, .importantIcon")) return;
    fetchMails();
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
            setIsStarred(!isStarred);
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
            setisImportant(!isImportant);
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
