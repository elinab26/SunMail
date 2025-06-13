import { useState, useEffect } from "react";
import "../css/Mail.css";
import { MdOutlineStarBorder } from "react-icons/md";
import { MdOutlineStar } from "react-icons/md";
import { MdLabelImportantOutline } from "react-icons/md";
import { MdLabelImportant } from "react-icons/md";
import { MdCheckBoxOutlineBlank } from "react-icons/md";
import { IoIosCheckboxOutline } from "react-icons/io";

function Mail({ mail, fetchMMails }) {
  const [isSelected, setisSelected] = useState(false);
  const [isStarred, setIsStarred] = useState(false);
  const [isImportant, setisImportant] = useState(false);

  return (
    <button className={`mailRow ${mail.read ? "read" : "unread"}`}>
      <button className="selectIcon" onClick={() => setisSelected(!isSelected)}>
        {isSelected ? (
          <span id="selectOn">
            <IoIosCheckboxOutline />
          </span>
        ) : (
          <MdCheckBoxOutlineBlank />
        )}
      </button>
      <button className="starIcon" onClick={() => setIsStarred(!isStarred)}>
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
        onClick={() => setisImportant(!isImportant)}
      >
        {isImportant ? (
          <span id="importantOn">
            <MdLabelImportant />
          </span>
        ) : (
          <MdLabelImportantOutline />
        )}
      </button>

      <span className="mailSender">{mail.from}</span>
      <div className="mailContent">
        <span className="mailSubject">{mail.subject}</span>
        <span className="mailBody"> - {mail.body}</span>
      </div>
    </button>
  );
}

export default Mail;
