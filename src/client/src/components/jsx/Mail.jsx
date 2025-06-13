import { useState, useEffect } from "react";
import "../css/Mail.css";

function Mail({ mail, fetchMMails }) {
  return (
    <div className="mail">
      <span className="mailName">{mail.from} </span>
      <span className="mailSubject">{mail.subject}</span>
    </div>
  );
}

export default Mail;
