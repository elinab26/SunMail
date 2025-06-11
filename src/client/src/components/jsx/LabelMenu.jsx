import "../css/LabelMenu.css";
import { useState, useEffect, useRef } from "react";
import AddLabel from "./AddLabel";
import EditLabel from "./EditLabel";
import DeleteLabel from "./DeleteLabel";
import { BsThreeDotsVertical } from "react-icons/bs";

function LabelMenu() {
  const [labels, setLabels] = useState([]);
  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);

  async function fetchLabels() {
    const res = await fetch("http://localhost:8080/api/labels", {
      credentials: "include",
    });
    const json = await res.json();
    setLabels(json);
  }

  // Fermer le popup en cliquant à l'extérieur
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setActivePopup(null);
      }
    }

    if (activePopup) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [activePopup]);

  useEffect(() => {
    fetchLabels();
  }, []);

  return (
    <div>
      <ul className="Labels">
        {labels.map((label) => (
          <li className="label" key={label.id}>
            <span className="labelName">{label.name}</span>
            <span className="labelIcon">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActivePopup(activePopup === label.id ? null : label.id);
                }}
              >
                <BsThreeDotsVertical />
              </button>
              {activePopup === label.id && (
                <div className="popupMenu" ref={popupRef}>
                  <EditLabel
                    label={label}
                    onUpdated={fetchLabels}
                    close={() => setActivePopup(null)}
                  />
                  <DeleteLabel
                    labelId={label.id}
                    onDeleted={fetchLabels}
                    close={() => setActivePopup(null)}
                  />
                </div>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LabelMenu;
