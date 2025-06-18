import "../css/LabelMenu.css";
import { useState, useEffect, useRef } from "react";
import Label from "./Label";


function LabelMenu({labels, fetchLabels}) {
  const [activePopup, setActivePopup] = useState(null);
  const popupRef = useRef(null);


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
    {labels.map((label) => {
      if (label.name === "spam"||label.name==="inbox") return null;
      return (
        <li key={label.id}>
          <Label label={label} fetchLabels={fetchLabels} />
        </li>
      );
    })}
  </ul>
</div>

  );
}

export default LabelMenu;
