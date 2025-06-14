import { useContext, useState, useEffect } from "react";
import { MailContext } from "../../contexts/MailContext";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../css/MailPage.css";

function MailPage() {
  const { mails } = useContext(MailContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const mail1 = mails.find((m) => m.id === id);

  useEffect(() => {
    if (!mail1) return <div>Mail not found</div>;
    async function fetchUser() {
      const res = await fetch(`http://localhost:8080/api/users/${mail1.from}`, {
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
  }, [mail1]);

  const mail = mails.find((m) => m.id === id);
  if (!mail) return <div>Mail not found</div>;

  return (
    <div className="mail-container">
      <button className="back-button" onClick={() => navigate(-1)}>
        <FaArrowLeft size={25} />
      </button>

      <div className="header">
        <div className="icon" />
        <h2 className="subject">{mail.subject}</h2>
      </div>

      <div className="divider" />

      <div className="mail-view">
        <div className="from">
          {user ? (
            user.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="profile"
                className="from-img"
              />
            ) : (
              <div className="from-fallback">
                {user ? user.name[0].toUpperCase() : "?"}
              </div>
            )
          ) : (
            <div>Loading...</div>
          )}
          <p className="from-name">
            <b>From:</b> {user ? user.name : mail.from}
          </p>
        </div>
        <p className="mail-body">{mail.body}</p>
      </div>
    </div>
  );
}

export default MailPage;
