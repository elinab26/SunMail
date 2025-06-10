import { useState } from "react";
import "../css/EditLabel.css";

function EditLabel({ label, onUpdated, close }) {
  const [labelName, setLabelName] = useState(label.name);
  const [isEditing, setIsEditing] = useState(false);

  async function editLabelHandler(event) {
    event.preventDefault();

    if (!labelName.trim()) {
      alert("Label name cannot be empty");
      return;
    }

    try {
      const updatedLabel = { name: labelName.trim() };

      const res = await fetch(`http://localhost:8080/api/labels/${label.id}`, {
        method: "PATCH", // ou "PUT" selon votre API
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "6ef925b2-7e25-4364-97c6-1c80b387e939",
        },
        body: JSON.stringify(updatedLabel),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      setIsEditing(false);
      await onUpdated();
      close();
    } catch (error) {
      console.error("Error updating label:", error);
      alert(`Error updating label: ${error.message}`);
    }
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setLabelName(label.name);
    setIsEditing(false);
    close();
  }

  if (isEditing) {
    return (
      <div className="editLabelForm">
        <form onSubmit={editLabelHandler}>
          <input
            type="text"
            value={labelName}
            onChange={(e) => setLabelName(e.target.value)}
            autoFocus
          />
          <div className="editButtons">
            <button type="submit" className="saveButton">
              Save
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="cancelButton"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button className="popupOption editOption" onClick={handleEdit}>
      Edit
    </button>
  );
}

export default EditLabel;
