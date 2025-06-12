import "../css/Label.css";
import EditLabel from "./EditLabel";
import DeleteLabel from "./DeleteLabel";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";

function Label({ label, fetchLabels }) {
  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);

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

  return (
    <div className="label">
      <span className="labelName">{label.name}</span>
      <span className="labelIcon">
        <button
          className="dots"
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
    </div>
  );
}

export default Label;
