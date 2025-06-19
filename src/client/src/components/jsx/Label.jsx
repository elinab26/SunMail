import "../css/Label.css";
import EditLabel from "./EditLabel";
import DeleteLabel from "./DeleteLabel";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";

function Label({ label, fetchLabels }) {
  const [activePopup, setActivePopup] = useState(null);
  const [activeOption, setActiveOption] = useState(null);

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

  useEffect(() => {
    if (activePopup && popupRef.current) {
      popupRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
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
            setActiveOption("both");
          }}
        >
          <BsThreeDotsVertical />
        </button>
        {activePopup === label.id && (
          <div
          className="popupMenu"
          ref={popupRef}    
          onMouseLeave={() => {       
            setActivePopup(null);
            setActiveOption(null);
          }}
        >
            <EditLabel
              label={label}
              onUpdated={() => {
                fetchLabels();
                setActiveOption(null);
              }}
              close={() => {
                setActivePopup(null);
                setActiveOption(null);
              }}
              onActivate={() => setActiveOption("edit")}
              active={activeOption === "edit" || activeOption === "both"}
            />
            <DeleteLabel
              labelId={label.id}
              onDeleted={() => {
                fetchLabels();
                setActiveOption(null);
              }}
              close={() => {
                setActivePopup(null);
                setActiveOption(null);
              }}
              onActivate={() => setActiveOption("delete")}
              active={activeOption === "delete" || activeOption === "both"}
            />
          </div>
        )}
      </span>
    </div>
  );
}

export default Label;
